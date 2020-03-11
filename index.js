const readline = require("readline");
const redis = require("redis");
const client = redis.createClient();

//the global object is like window object in browser

global.redisSetKey = () => {
  client.set(
    "user:ali",
    JSON.stringify({ name: "ali", age: 32, gender: "male" }),
    function(err, result) {
      console.error(err);
      console.log(result);
    }
  );
};

global.redisGetKey = () => {
  client.get("user:ali", (err, result) => {
    console.error(err);
    console.log(result);
  });
};

global.redisGetKeys = () => {
  client.keys("user:*", (err, result) => {
    console.error(err);
    console.log(result);

    result.forEach(key => {
      client.get(key, (err, result) => {
        console.log(result);
      });
    });
  });
};

//region Commandline Settings
const functionList = Object.keys(global).filter(item => item.includes("redis"));
console.log(functionList.map((item, index) => `${index} - ${item}`).join("\n"));

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.question(`Selected Function: `, answer => {
  global[functionList[answer]]();
});
//endregion

