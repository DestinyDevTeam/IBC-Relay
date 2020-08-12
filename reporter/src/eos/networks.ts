import { JsonRpc } from "eosjs";
import fetch from "node-fetch";
import { NetworkName } from "../types";
import { getEnvConfig } from "../dotenv";
import { isProduction, unmapNetworkName } from "../utils";

export const getContractsForNetwork = (
  network: NetworkName
): {
  token: string;
  ibc: string;
  cpuPayer: string;
  reporterAccount: string;
  reporterPermission: string;
} => {
  network = unmapNetworkName(network);
  const envConfig = getEnvConfig();
  switch (network) {
    case `eostest`:
      return {
        token: `tethertether`,
        ibc: `tlosd.eos.io`,
        cpuPayer: `telosdcpunet`,
        ...((envConfig.eostest || {}) as any),
      };
    case `telostest`:
      return {
        token: `tokens.swaps`,
        ibc: `telosd.io`,
        cpuPayer: `admin.swaps`,
        ...((envConfig.telostest || {}) as any),
      };
    case `eos`:
      return {
        token: `eosdtsttoken`,
        ibc: `telosd.io`,
        cpuPayer: `telosdcpunet`,
        ...((envConfig.eos || {}) as any),
      };
    case `telos`:
      return {
        token: `tethertether`,
        ibc: `telosd.io.`,
        cpuPayer: `admin.swaps`,
        ...((envConfig.telos || {}) as any),
      };
    default:
      throw new Error(
        `No contract accounts for "${network}" network defined yet`
      );
  }
};

const createNetwork = (nodeEndpoint, chainId) => {
  const matches = /^(https?):\/\/(.+?)(:\d+){0,1}$/.exec(nodeEndpoint);
  if (!matches) {
    throw new Error(
      `Could not parse HTTP endpoint for chain ${chainId}. Needs protocol and port: "${nodeEndpoint}"`
    );
  }

  const [, httpProtocol, host, portMatch] = matches;
  const portString = portMatch
    ? portMatch.replace(/\D/gi, ``)
    : httpProtocol === `https`
    ? `443`
    : `80`;
  const port = Number.parseInt(portString, 10);

  return {
    chainId,
    protocol: httpProtocol,
    host,
    port,
    nodeEndpoint,
  };
};

const EosTestNetwork = createNetwork(
  process.env.EOSTEST_ENDPOINT || `https://testnet.telos.africa:443`,
  `1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f`
);
const TelosTestNetwork = createNetwork(
  process.env.TELOSTEST_ENDPOINT || `https://testnet.telos.africa:443`,
  `1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f`
);
const EosNetwork = createNetwork(
  process.env.EOS_ENDPOINT,
  `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`
);
const TelosNetwork = createNetwork(
  process.env.TELOS_ENDPOINT,
  `4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11`
);

function getNetwork(networkName: string) {
  switch (networkName) {
    case `eos`:
      return EosNetwork;
    case `telos`:
      return TelosNetwork;
    case `eostest`:
      return EosTestNetwork;
    case `telostest`:
      return TelosTestNetwork;
    default:
      throw new Error(`Network "${networkName}" not supported yet.`);
  }
}

export const getRpc: (networkName: string) => JsonRpc = (() => {
  const rpcs = {};

  return (networkName: string) => {
    let _networkName = unmapNetworkName(networkName as NetworkName);
    if (!rpcs[networkName]) {
      rpcs[networkName] = new JsonRpc(getNetwork(_networkName).nodeEndpoint, {
        fetch: fetch,
      });
    }

    return rpcs[networkName];
  };
})();
