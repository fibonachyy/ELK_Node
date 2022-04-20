"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const express_1 = __importDefault(require("express"));
const winston_logstash_ts_1 = require("winston-logstash-ts");
const logStash = winston_logstash_ts_1.LogstashTransport.createLogger("logstash_example", {
    host: "http://127.0.0.1",
    port: 9500,
    // format: Logform.format.combine(
    //   Logform.format.timestamp(),
    //   Logform.format.logstash()
    // ),
});
const app = (0, express_1.default)();
const ELASTIC_CLUSTER_NODES = [
    "http:127.0.0.1:19200",
    "http:127.0.0.1:29200",
    "http:127.0.0.1:39200",
];
const client = new elasticsearch_1.Client({
    nodes: ELASTIC_CLUSTER_NODES,
    requestTimeout: 2000,
    sniffInterval: 500,
    sniffOnStart: true,
    sniffOnConnectionFault: true,
});
function getInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield client.info();
        console.log(info);
    });
}
function TestSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const test = yield client.search({ index: "ilm-history-5*" });
        console.log(test.body.hits.hits);
    });
}
getInfo();
TestSearch().catch(console.log);
app.use((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { method, body, path } = request;
    const test = yield logStash.info({
        path: `${method.toUpperCase()} - ${path}`,
        body,
    });
    console.log(test);
    next();
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.send("hello world");
    }
    catch (e) {
        console.log(e);
    }
}));
// app.get("/methods/:method", async (req: Request, res: Response) => {
//   try {
//     const { method } = req.params;
//     if (!method) return res.send("method required!!!");
//     const data = await client.search({
//       index: method,
//       max_concurrent_shard_requests: 10000,
//     });
//     res.send(data.body.hits);
//   } catch (e) {
//     console.log(e);
//   }
// });
const _PORT = 3000;
app.listen(_PORT, () => console.info(`application run on port ${_PORT}`));
//# sourceMappingURL=index.js.map