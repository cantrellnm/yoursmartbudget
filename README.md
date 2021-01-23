# Your Smart Budget

A MERN-stack personal budgeting app that integrates with the Plaid API.

Features:
- Get recent transaction and balance information from your financial accounts.
- Set up budgets with multiple spending categories. Transactions are automatically assigned to these budgets and the amount subtracted from your available budget.
- Adjustable budget period (ex: 2 weeks or 1 month).
- Set up "planned" transactions and automatically set aside money to pay for them (or don't). Planned transactions can be recurring.
- Create "pending" transactions as a placeholder until recent transactions go through.
- See how much money you **actually** have available to spend or save, because budgeted/planned/pending transactions are subtracted from available funds (accounts with positive balances that aren't hidden).
- Option to also subtract credit balance(s) from available funds. (If the full balance will be paid, otherwise it's better to create a planned transaction for partial payment.)

## Requirements

### Plaid API account
YSB integrates with the [Plaid API](https://plaid.com/docs/), so you'll need an account with them to run your own instance of this project. A free dev account is limited to 100 "live items" (connections to financial institutions) which is why this project is available as source code and not a URL to a running app.
### Google OAuth Credentials
Google OAuth is used for logging in. You can create "OAuth 2.0 Client ID" credentials for your server in the [Google API Console](https://console.developers.google.com/).
### MongoDB URL
MongoDB is used for storing some user information. (Application settings, basic account information like name and account type, some transaction information like date and amount.) It *NEVER STORES* email addresses, usernames/passwords, full account numbers, or balances.

## Development

When running locally, first set your environment variables in an `.env` file. You will need yarn installed to run various scripts (`npm install -g yarn`). Then run `yarn install` and `yarn build`.

You will also need MongoDB installed and running with `mongod` before starting the server at `http://localhost:8000` with `yarn workspace server dev`.

If making changes to `client` (the React app), start it up with `yarn workspace client dev` and go to `http://localhost:3000` instead. (The client needs the server to work, but the server doesn't need the client app running as long as the `client/build` files are there.)

**OR** run both in parallel with `yarn dev`!

The `client/build` files should not be committed to the repo. On production they'll be generated with `yarn build` before starting the server with `yarn start`.

## Environment variables

The following environment variables need to be assigned for all environments:
- DB_URI
- PLAID_CLIENT_ID
- PLAID_SECRET
- PLAID_PUBLIC_KEY
- PLAID_ENV
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

Additionally, make sure you set on production:
- ENCRYPTION_KEY
- SIGNING_KEY
- NODE_ENV=production
