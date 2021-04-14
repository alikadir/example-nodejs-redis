const readline = require("readline");
const redis = require("redis");
const client = redis.createClient();


const getGlobal = () => {
  if (typeof self !== 'undefined') { return self; } // in nodejs
  if (typeof window !== 'undefined') { return window; } // in browser
  if (typeof global !== 'undefined') { return global; } 
  throw new Error('unable to locate global object');
};

const myGlobal = getGlobal();


myGlobal.redisSetKey = () => {
  client.set(
    "user:ali",
    JSON.stringify({ name: "ali", age: 32, gender: "male" }),
    function(err, reply) {
      console.error(err);
      console.log(reply);
    }
  );
};

// redis library does not support Promise build-in now (maybe v4) so we use callback "function (err, reply) { }"
/*
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
 
const value = await getAsync("key");
*/

// alternative npm i ioredis
// Also we can add TTL to key client.expire("user:ali", 10); // seconds

myGlobal.redisGetKey = () => {
  client.get("user:ali", (err, reply) => {
    console.error(err);
    console.log(reply);
  });
};

myGlobal.redisGetKeys = () => {
  client.keys("user:*", (err, reply) => {
    console.error(err);
    console.log(reply);

    reply.forEach(key => {
      client.get(key, (err, reply) => {
        console.log(reply);
      });
    });
  });
};

myGlobal.redisPublishMessage = () => {
  client.publish("sample-channel", "sample message...", (err, reply) => {
    console.error(err);
    console.log(reply); // number of client that is submitted message
  });
};

myGlobal.redisSubScribeMessage = () => {
  client.subscribe("sample-channel");
  client.on("message", (channel, message) => {
    console.log("receive message; ");
    console.log("channel: ", channel);
    console.log("message: ", message);
  });
};

//region Commandline Settings
const functionList = Object.keys(myGlobal).filter(item => item.includes("redis"));
console.log(functionList.map((item, index) => `${index} - ${item}`).join("\n"));

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.question(`Selected Function: `, answer => {
  myGlobal[functionList[answer]]();
});
//endregion
