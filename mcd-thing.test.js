const McdPlugin = require('@makerdao/dai-plugin-mcd');
const Maker = require('@makerdao/dai');

let maker, cdp, txMgr, cdpManager;

beforeAll(async (done) => {
    if (!process.env.PRIVATE_KEY && process.env.NETWORK !== 'test') {
      throw new Error('Please set a private key to run integration tests.');
    }
  
    console.info(McdPlugin.ETH)

    maker = await Maker.create("http", {
        privateKey: process.env.PRIVATE_KEY,
        url: process.env.JSON_RPC,
        plugins: [
            [
              McdPlugin,
              {
                cdpTypes: [
                  { currency: McdPlugin.ETH }      
                ]
              }
            ]
          ]
    });
  
    await maker.authenticate();

    // Getting an error here so trying to just ignore for now
    // await maker.service('proxy').ensureProxy();

    // maker.service('accounts').listAccounts()

    cdpManager = await maker.service('mcd:cdpManager');


    // cdp = await cdpManager.openLockAndDraw('FOO', ETH(50), MDAI(1000));


    tokenService = maker.service('token');
    address = maker.service('web3').currentAddress();
    txMgr = maker.service('transactionManager');
    txMgr.onNewTransaction(txo => {
      const {
        metadata: { contract, method } = { contract: '???', method: '???' }
      } = txo;
      const label = `tx : ${contract}.${method}`;
      console.info(`${label}: new`);
  
      txo.onPending(() => console.info(`${label}: pending`));
      txo.onMined(() => console.info(`${label}: mined`));
      txo.onFinalized(() => console.info(`${label}: confirmed`));
    });
    done()
});

test('can open CDP', async () => {
    await maker.authenticate();
    cdp = await cdpManager.openLockAndDraw('FOO', McdPlugin.ETH(50), McdPlugin.MDAI(1000));
    console.info('Opened new CDP', cdp.id);
    expect(cdp).toBeDefined();
}, 100000);
