import { SvelteDate } from "svelte/reactivity";

const localStorageKey = "DSBA-data";
const localStorageCurrentVersion = 2;

export type Expense = {
  id: string;
  amount: number;
  date: string;
};

export type Wallet = {
  id: string;
  balance: number;
  name: string;
  expenses: Expense[];
};

type Persistence = {
  version: number;
  activeWallet: string;
  wallets: Wallet[];
  onboardingCompleted: boolean;
};

type PersistenceResult =
  | { loading: true; error: false; data: undefined }
  | { loading: false; error: true; data: undefined }
  | { loading: false; error: false; data: Persistence };

let persistenceResult = $state<PersistenceResult>({
  loading: true,
  error: false,
  data: undefined,
});

function getPersistenceMaybe(): Persistence | undefined {
  if (persistenceResult.loading) return undefined;
  if (persistenceResult.error) return undefined;
  return persistenceResult.data;
}

function getPersistence(): Persistence {
  if (persistenceResult.loading) throw new Error("still loading");
  if (persistenceResult.error) throw new Error("error loading");
  return persistenceResult.data;
}

function loadPersistenceResult(): PersistenceResult {
  try {
    const rawContents = localStorage.getItem(localStorageKey);
    if (!rawContents) {
      const id = crypto.randomUUID();
      const data: Persistence = {
        version: localStorageCurrentVersion,
        activeWallet: id,
        wallets: [{ id, balance: 0, name: "Budget", expenses: [] }],
        onboardingCompleted: false,
      };
      return { loading: false, error: false, data };
    }
    let data = JSON.parse(rawContents);

    if (!data.version) throw new Error("version missing :/");
    if (data.version === 1) data = migrateV1toV2(data);
    if (data.version !== localStorageCurrentVersion) {
      throw new Error("version not supported");
    }

    return { loading: false, error: false, data };
  } catch (error) {
    console.error(error);
    return { error: true, loading: false, data: undefined };
  }
}

$effect.root(() => {
  persistenceResult = loadPersistenceResult();
});

$effect.root(() => {
  $effect(() => {
    try {
      const persistence = getPersistenceMaybe();
      if (persistence === undefined) return;
      localStorage.setItem(localStorageKey, JSON.stringify(persistence));
    } catch (error) {
      console.error(error);
    }
  });
});

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== localStorageKey) return;
    persistenceResult = loadPersistenceResult();
  });
}

export function isPersistenceLoading(): boolean {
  return persistenceResult.loading;
}

export function isPersistenceError(): boolean {
  return persistenceResult.error;
}

export function isOnboardingCompleted(): boolean {
  return Boolean(getPersistenceMaybe()?.onboardingCompleted);
}

export function setOnboardingCompleted(): void {
  getPersistence().onboardingCompleted = true;
}

export function getWallets(): Wallet[] {
  return getPersistence().wallets;
}
export function isWalletDeletable(): boolean {
  return getPersistence().wallets.length > 1;
}

export function findWallet(walletId: string): Wallet {
  const wallet = getPersistence().wallets.find(({ id }) => id === walletId);
  if (!wallet) throw new Error("wallet not found");
  return wallet;
}

export function getActiveWallet(): Wallet {
  return findWallet(getPersistence().activeWallet);
}

export function setActiveWallet(id: string): void {
  const wallet = findWallet(id);
  getPersistence().activeWallet = wallet.id;
}

export function editActiveWallet({
  name,
  balance,
}: {
  name: string;
  balance: number;
}): void {
  const wallet = findWallet(getPersistence().activeWallet);
  wallet.name = name;
  wallet.balance = balance;
}

export function createNewAndActiveWallet({
  name,
  balance,
}: {
  name: string;
  balance: number;
}): void {
  const id = crypto.randomUUID();
  const wallet: Wallet = { id, balance, name, expenses: [] };
  getPersistence().wallets.push(wallet);
  getPersistence().activeWallet = wallet.id;
}

export function deleteActiveWallet(): void {
  getPersistence().wallets = getPersistence().wallets.filter(
    ({ id }) => id !== getPersistence().activeWallet,
  );
  getPersistence().activeWallet = getPersistence().wallets[0].id;
}

export function addExpense(amount: number): void {
  const wallet = getActiveWallet();
  wallet.expenses.push({
    id: crypto.randomUUID(),
    amount,
    date: new SvelteDate().toISOString(),
  });
  wallet.balance += amount;
}

function migrateV1toV2(data: Persistence): Persistence {
  const toCents = (input: number) => Math.round(input * 100);
  return {
    ...data,
    version: 2,
    wallets: data.wallets.map((wallet) => ({
      ...wallet,
      balance: toCents(wallet.balance),
      expenses: wallet.expenses.map((expense) => ({
        ...expense,
        amount: toCents(expense.amount),
      })),
    })),
  };
}
