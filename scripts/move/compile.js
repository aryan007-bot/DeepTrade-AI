require("dotenv").config();
const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js");

async function compile() {
  const move = new cli.Move();

  await move.compile({
    packageDirectoryPath: "contract",
    namedAddresses: {
      // Compile module with account address
      trading_bot_addr: process.env.NEXT_MODULE_PUBLISHER_ACCOUNT_ADDRESS || "0x64b0d0c590ac866988e39442f4bb7dc69f9ee956d9b45ed3128f751f2e430c1a",
    },
  });
}
compile();
