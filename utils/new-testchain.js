var fs = require('fs');

const testchainDir = "../testchain-dss-deployment-scripts/out/addresses.json"
const daiDir = "./node_modules/@makerdao/dai/contracts/addresses/testnet.json"
const mcdDir = "./node_modules/@makerdao/dai-plugin-mcd/contracts/addresses/testnet.json"

var testchainOut = fs.readFileSync(testchainDir);
var testchainJson = JSON.parse(testchainOut);

var daiOut = fs.readFileSync(daiDir);
var daiJson = JSON.parse(daiOut);

var mcdOut = fs.readFileSync(mcdDir);
var mcdJson = JSON.parse(mcdOut);

// There are some vars in the mcdJson that are not in the testchainJson
// We do not need them for the tests but the code will fail without them (looking at you DGX)
// Due do this we are not doing a straight up replace
for (var key in mcdJson) {
    if (testchainJson.hasOwnProperty(key)) {
        mcdJson[key] = testchainJson[key];
    }
}

// We need to replace the proxy registry
daiJson["PROXY_REGISTRY"] = testchainJson["PROXY_REGISTRY"]

fs.writeFile(daiDir, JSON.stringify(daiJson), 'utf8', 
    function(err){
        if(err) throw err;
    } 
);

fs.writeFile(mcdDir, JSON.stringify(mcdJson), 'utf8', 
    function(err){
        if(err) throw err;
    } 
);