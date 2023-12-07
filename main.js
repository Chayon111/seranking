const { run } = require("./bot");
const { start } = require("./server");

run().then(() => {
  start(5500);
});
