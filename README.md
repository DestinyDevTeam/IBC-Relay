# IBC Reporter Heroku Alpha Version - Currently Telos Only

Nodejs app running on a server that scans all blockchans for events and handles IBC.

---

## Heroku

This Fork is reconfigured to run on Heroku with Pm2-runtime

- BuildPack Index 1: https://github.com/timanovsky/subdir-heroku-buildpack.git ( If using a GitHub subdirectory )

- BuildPack Index 2: heroku/nodejs

- No Procfile Required

Required Heroku Environment Variables:

- NODE_ENV = production or development

- NPM_VER = Your NPM Version

- PORT = 1111

- PROJECT_PATH = reporter ( Or your custom GitHub subdirectory )

RPC Node Endpoints:

- chain_ENDPOINT where supported chains are EOS, TELOS or WAX = https://preferred.rpc.endpoint

IBC Configuration

- chain_IBC where supported chains are EOS, TELOS or WAX = Accoun, Permission, privKey, cpuPayer, cpuKey

- WATCH_NET = Supported Values: eos, telos, wax

Environment is set to clustered execution mode and 1 interface ( max return 8 )
