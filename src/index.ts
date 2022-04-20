"use strict";

import { Client } from "@elastic/elasticsearch";
import Express, { Response, Request } from "express";
import winston, { Logform } from "winston";

import { LogstashTransport } from "winston-logstash-ts";

const logStash = LogstashTransport.createLogger("logs-logstash_example", {
  host: "http://127.0.0.1",
  port: 9200,

  // format: Logform.format.combine(
  //   Logform.format.timestamp(),
  //   Logform.format.logstash()
  // ),
});

const app = Express();

// const ELASTIC_CLUSTER_NODES = [
//   "http:127.0.0.1:19200",
//   "http:127.0.0.1:29200",
//   "http:127.0.0.1:39200",
// ];
// const client = new Client({
//   nodes: ELASTIC_CLUSTER_NODES,
//   requestTimeout: 2000,
//   sniffInterval: 500,
//   sniffOnStart: true,
//   sniffOnConnectionFault: true,
// });

app.use(async (request, response, next) => {
  const { method, body, path } = request;
  const test = await logStash.info({
    path: `${method.toUpperCase()} - ${path}`,
    body,
  });
  console.log(test);
  next();
});

app.get("/", async (req: Request, res: Response) => {
  try {
    return res.send("hello world");
  } catch (e) {
    console.log(e);
  }
});

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
const _PORT: number = 3000;
app.listen(_PORT, () => console.info(`application run on port ${_PORT}`));
// setInterval(async () => {
//   try {
//     const info = await client.info();
//     console.log(info.body.name);
//   } catch (err) {
//     console.log(err.message);
//   }
// }, 1500);

// async function run() {
//   // Let's start by indexing some data
//   await clien
// t.index({
//     index: "game-of-thrones",
//     document: {
//       character: "Ned Stark",
//       quote: "Winter is coming.",
//     },
//   });

//   await client.index({
//     index: "game-of-thrones",
//     document: {
//       character: "Daenerys Targaryen",
//       quote: "I am the blood of the dragon.",
//     },
//   });

//   await client.index({
//     index: "game-of-thrones",
//     document: {
//       character: "Tyrion Lannister",
//       quote: "A mind needs books like a sword needs a whetstone.",
//     },
//   });

//   // here we are forcing an index refresh, otherwise we will not
//   // get any result in the consequent search
//   await client.indices.refresh({ index: "game-of-thrones" });

//   // Let's search!
//   const result = await client.search({
//     index: "game-of-thrones",
//     query: {
//       match: { quote: "winter" },
//     },
//   });

//   console.log(result.hits.hits);
// }

// run().catch(console.log);
