Here is a little quick start. If you run all this you _should_ be able to run the tests

## Terminal 1 (from anywhere)
```
$ dapp testnet
```

## Terminal 2 (from testchain-dss-deploy-scripts)
```
$ <any testchain-dss-deploy config stuff needed>
$ ./step-4-deploy
```

## Terminal 3
```
$ export PRIVATE_KEY=<Your private key>
$ export JSON_RPC=http://127.0.0.1:8545
$ yarn update (this is going to move your testchain-dss-deploy stuff to the right place. You might need to change the file locations in the js)
$ yarn test
```

You might need to change the network in the `@makerdao/dai` node module. This is in `@makerdao/dai/contracts/networks.js` and you need to change the `TESTNET_ID` to be equal to your testchain id (default 99)