const Maker = require('@makerdao/dai');
let maker, cdp, txMgr;

beforeAll(async (done) => {
    if (!process.env.PRIVATE_KEY && process.env.NETWORK !== 'test') {
      throw new Error('Please set a private key to run integration tests.');
    }
  
    maker = await Maker.create("http", {
        privateKey: process.env.PRIVATE_KEY,
        url: process.env.JSON_RPC
    });
  
    await maker.authenticate();
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
    cdp = await maker.openCdp();
    console.info('Opened new CDP', cdp.id);
    expect(cdp).toBeDefined();
}, 100000);

test('can lock eth', async () => {
    const initialCollateral = await cdp.getCollateralValue();
    const lock = cdp.lockEth(0.01);
    await txMgr.confirm(lock);
    const collateral = await cdp.getCollateralValue();
    expect(collateral.toNumber()).toBeGreaterThan(initialCollateral.toNumber());
}, 600000);

test('can withdraw Dai', async () => {
    const initialDebt = await cdp.getDebtValue();
    const draw = cdp.drawDai(0.1);
    await txMgr.confirm(draw);
    const currentDebt = await cdp.getDebtValue();
    expect(currentDebt.toNumber()).toBeGreaterThan(initialDebt.toNumber());
}, 300000);

test('can wipe debt', async () => {
    const initialDebt = await cdp.getDebtValue();
    const wipe = cdp.wipeDai('0.1');
    await txMgr.confirm(wipe);
    const currentDebt = await cdp.getDebtValue();
    expect(initialDebt.toNumber()).toBeGreaterThan(currentDebt.toNumber());
}, 600000);

test('can shut a CDP', async () => {
    await cdp.shut();
    await convertPeth();
    await convertWeth();
    const info = await cdp.getInfo();
    expect(info.lad).toBe('0x0000000000000000000000000000000000000000');
}, 1200000);