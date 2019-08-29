<p align="center">
  <img src="https://avatars0.githubusercontent.com/u/41934032?s=400&v=4" alt="Crypto.com Chain" width="400">
</p>

## Crypto.com Chain Sample Wallet

This repository contains a sample implementation of Crypto.com Chain wallet with integration of [client JSON-RPC server](https://github.com/crypto-com/chain/tree/master/client-rpc).

### Prerequisites

- Node.js: https://nodejs.org/en/
- Angular CLI: https://cli.angular.io/ 
- Crypto.com Chain: https://github.com/crypto-com/chain

### How to run wallet

- Start Crypto.com Chain by following instructions in the Crypto.com Chain repository
- Run `npm install` to fetch all the dependencies of wallet.
- Run `ng serve` to start the wallet.
- Navigate to `http://localhost:4200/`.

### How to create a new wallet

- A new wallet can be created using `Add wallet` button on UI and entering wallet name and passphrase.

### How to receive funds

- Share your wallet address and view key with with sender. Both, wallet address and view key, can be obtained by clicking `Receive funds` button

### How to send funds

- You can send funds by clicking `Send funds` button and entering recepient's wallet address, view key and other necessary details.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Contribution

TODO

## License

[Apache 2.0](./LICENSE)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
