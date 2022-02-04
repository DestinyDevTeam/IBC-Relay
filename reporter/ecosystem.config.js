const ms = require('ms')
module.exports = {
  apps : [{
    name   : "ibc-worker",
    script : "./build/index.js",
    instances : 1,
    exec_mode : "cluster",
    env_production: {
       PORT: process.env.PORT,
       TELOS_ENDPOINT: process.env.TELOS_ENDPOINT,
       TELOS_IBC: process.env.TELOS_IBC,
       NODE_ENV: process.env.NODE_ENV
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
