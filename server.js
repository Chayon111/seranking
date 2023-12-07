const express = require("express");
const { getOverview } = require("./bot");
const app = express();

app.get("/", async (req, res) => {
  res.send("Running");
});

app.get("/overview", async (req, res) => {
  req.setTimeout(0);
  const { keyword, country } = req.query;
  if (!keyword) {
    res.send(false);
    return;
  }
  const data = await getOverview({ keyword, country });
  res.json(data);
});

exports.start = (port) => {
  app.listen(port);
  console.log(`app is running on http://localhost:${port}`);
};
