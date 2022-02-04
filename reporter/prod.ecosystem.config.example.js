const ms = require('ms')
module.exports = {
  apps: [
    {
      name: "ibc-worker",
      script: "./build/index.js",
      env: {
        PORT: "1111", // you can use /health and /logs for monitoring
        WAX_ENDPOINT: "https://wax.greymass.com",
        WAX_IBC: "boidcomnodes;active;5JCPYLpip...",
        TELOS_ENDPOINT: "https://telos.caleos.io",
        TELOS_IBC: "boidcomnodes;active;5MHPDUfsp...",
        EOS_ENDPOINT: "https://eos.greymass.com",
        EOS_IBC: "boidcomnodes;active;5DSPTRfid...",
        NODE_ENV: "production"
      }
    },
  ]
};