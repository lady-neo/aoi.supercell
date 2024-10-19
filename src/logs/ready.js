const { AoiError } = require("aoi.js");
const { version } = require("../../package.json");

const installed = () => {
  AoiError.createConsoleMessage([{ text: `Installed on v${version}`, textColor: "green" }], borderColor = "white", { text: "aoi.supercell", textColor: "cyan" });
};

const tokenManagerInfo = (context) => {
  const messages = [
    { text: "Token Registration Method:", textColor: "white" },
    { text: `${context.registerTokenMethod}`, textColor: "yellow" },
  ];

  if (context.registerTokenMethod === "file") {
    messages.push(
      { text: "Token Registration Path:", textColor: "white" },
      { text: `${context.tokenPath}`, textColor: "yellow" }
    );
  }

  AoiError.createConsoleMessage(messages, borderColor: "white", { text: "Token Manager Info", textColor: "cyan" });
};

module.exports = { installed, tokenManagerInfo };
