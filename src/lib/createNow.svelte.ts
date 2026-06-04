import { SvelteDate } from "svelte/reactivity";

export function createNow() {
  const now = new SvelteDate();

  $effect(() => {
    const interval = setInterval(() => {
      now.setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  });

  return now;
}
