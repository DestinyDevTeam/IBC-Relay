"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const logger_1 = require("./logger");

const reporter_1 = __importDefault(require("./reporter"));
const networks_1 = require("./eos/networks");

async function start() {
    const app = express_1.default();
    
    app.enable("trust proxy");
    app.use(body_parser_1.default.json());
    // register express routes from defined application routes
    routes_1.Routes.forEach(route => {
        app[route.method](route.route, (req, res, next) => {
            const result = new route.controller()[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined
                    ? res.send(result)
                    : undefined);
            }
            else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
    // start express server
    const PORT = process.env.PORT || 8080;
    const VERSION = process.env.NPM_VER;
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.listen(PORT);
    console.log("First Passed");
    let networks_to_watch = process.env.WATCH_NET;
    // Test WATCH_NET Environment Variable
    console.log(networks_to_watch);
    
    // Create Array to Support strinh Mapping
    const watch_nets = networks_to_watch.split(',');
    
    logger_1.logger.info(`Reporter v${VERSION}: Express server has started on port ${PORT}. Open http://localhost:${PORT}/logs`);
    //logger_1.logger.info(`Using endpoints ${networks_to_watch.map(network => networks_1.getRpc(network).endpoint).join(`, `)}`);
    logger_1.logger.info(`Using endpoints ${watch_nets.map(network => networks_1.getRpc(network).endpoint).join(`, `)}`);
    //const reporters = networks_to_watch.map(network => new reporter_1.default(network));
    
    const reporters = watch_nets.map(network => new reporter_1.default(network));
    reporters.map(reporter => reporter.start());
    // Test Final Reporter structure
    console.log(reporters); 
}
start().catch(error => logger_1.logger.error(error.message || error));
process.on("unhandledRejection", function (reason, p) {
    let message = reason ? reason.stack : reason;
    logger_1.logger.error(`Possibly Unhandled Rejection at: ${message}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
