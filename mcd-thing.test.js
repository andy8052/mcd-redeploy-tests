const McdPlugin = require('@makerdao/dai-plugin-mcd');
const Maker = require('@makerdao/dai');

let maker, cdp, txMgr, cdpManager, proxy, dai, eth, rep;

beforeAll(async (done) => {
    if (!process.env.PRIVATE_KEY && process.env.NETWORK !== 'test') {
      throw new Error('Please set a private key to run integration tests.');
    }
  
    maker = await Maker.create("http", {
        privateKey: process.env.PRIVATE_KEY,
        url: process.env.JSON_RPC,
        plugins: [
            [
              McdPlugin.default,
              {
                cdpTypes: [
                  { currency: McdPlugin.ETH }      
                ]
              }
            ]
          ]
    });
  
    await maker.authenticate();
    await maker.service('proxy').ensureProxy();
    proxy = await maker.currentProxy();

    let { currency } = await maker.service('mcd:cdpType').getCdpType(null, 'ETH');
    await maker.getToken(currency).approveUnlimited(proxy);


    dai = maker.getToken(McdPlugin.MDAI);
    await dai.approveUnlimited(proxy);

    // console.info(dai)
    // currency = await maker.service('mcd:cdpType').getCdpType(null, 'DAI');

    cdpManager = await maker.service('mcd:cdpManager');

    tokenService = maker.service('token');
    // address = maker.service('web3').currentAddress();
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
    // await maker.authenticate();
    // cdp = await cdpManager.open('ETH');
    cdp = await cdpManager.openLockAndDraw('ETH', McdPlugin.ETH(1), McdPlugin.MDAI(1));
    console.info('Opened new CDP', cdp.id);
    expect(cdp).toBeDefined();
}, 100000);
