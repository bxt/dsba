# DSBA

**Damn Simple Budget App**

At some place I just had a wallet with cash. Keeping track of your expenses was simple: On one glace you could see how many bills you have left, and when they were gone, they were gone. Nowadays, things are more complicated: Multiple bank accounts, credit cards, sharing a meal with friends, Amazon vouchers, PayPal balance. One solution to this problem is to connect all those with a central service that tracks your expenses and have an AI classify those into budgets, and there are some great solutions out there. To me, this feels too complex and data-hungry. Instead, I just want a digital version of a wallet, that just keeps track of how much money I have left, and for this I am willing to enter my expenses manually. This is what DSBA (Damn Simple Budget App) was made for.

You can use the app here: https://bxt.github.io/dsba/ By default, no data is sent to me or Github, but if you don't trust this, you can also self-host the app. You can either build it yourself from the instructions below or use the static files built in GitHub actions.

## Developing

Once you've checked out the project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

To run the tests, prepare by doing `npx playwright install` and then run those commands:

```sh
pnpm run test:unit
pnpm run test:e2e --ui
```

To run the linting and formatting (if not done by the editor anyways) run:

```sh
pnpm run lint
```

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.
