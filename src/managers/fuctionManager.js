module.exports = (functionManager) => {
  functionManager.createFunction({
    name: "$registerToken",
    type: "djs",
    code: require("../functions/registerToken.js"),
  });

  functionManager.createFunction({
    name: "$unregisterToken",
    type: "djs",
    code: require("../functions/unregisterToken.js"),
  });

  functionManager.createFunction({
    name: "$getTokens",
    type: "djs",
    code: require("../functions/getTokens.js"),
  });

  functionManager.createFunction({
    name: "$getTokenValue",
    type: "djs",
    code: require("../functions/getTokenValue.js")
  });

  functionManager.createFunction({
    name: "$getPlayerName",
    type: "djs",
    code: require("../functions/getPlayerName.js")
  });

  functionManager.createFunction({
    name: "$getPlayerTrophies",
    type: "djs",
    code: require("../functions/getPlayerTrophies.js")
  });

  functionManager.createFunction({
    name: "$getPlayerClubName",
    type: "djs",
    code: require("../functions/getPlayerClubName.js")
  });
  
  functionManager.createFunction({
    name: "$getPlayerClubID",
    type: "djs",
    code: require("../functions/getPlayerClubID.js")
  });
  
  functionManager.createFunction({
    name: "$getPlayerClubTrophies",
    type: "djs",
    code: require("../functions/getPlayerClubTrophies.js")
  })
};
