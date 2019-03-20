import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';

let maker, data, cdp, txMgr, cdpManager, proxy, dai, eth, rep;

async function blah() {
    const maker = await Maker.create("http", {
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
    console.log("authenticated")

    await maker.service('proxy').ensureProxy();
    proxy = await maker.currentProxy();

    // let { currency } = await maker.service('mcd:cdpType').getCdpType(null, 'ETH');
    // console.info(currency)
    // await maker.getToken(currency).approveUnlimited(proxy);
    // console.info("unlocked all ETH")

    // dai = maker.getToken(McdPlugin.MDAI);
    // await dai.approveUnlimited(proxy);
    // console.info("unlocked all DAI")

    cdpManager = await maker.service('mcd:cdpManager');
    data = await maker.service('mcd:systemData');

    let ceiling = await data.getSystemWideDebtCeiling();
    console.info("-- Global debt ceiling set at", ceiling);

    // ceiling = await maker.service('mcd:cdpType').getCdpType(McdPlugin.ETH, 'ETH-A').getDebtCeiling();
    // console.info("-- ETH debt ceiling set at", ceiling);

    process.exit()
}

blah();