const intent_types = {
  I: "Informational",
  N: "Navigational",
  T: "Transactional",
  C: "Commercial",
  L: "Local",
};

exports.filter = (jsons) => {
  let [cpcInfo, stats, global] = jsons;
  cpc = cpcInfo.data;
  cpc["CPC"] = stats.data.cpc;
  delete cpc.partial;
  globalVolume = global.data;
  totalVolume = Object.values(globalVolume).reduce(
    (total, country) => total + country.volume,
    0
  );
  globalVolume["total"] = { volume: totalVolume, percent: 100 };
  return {
    difficulty: stats.data.keyword_difficulty,
    volume: stats.data.volume,
    intent: stats.data.intents.map((intent) => intent_types[intent]),
    cpc,
    globalVolume,
  };
};
