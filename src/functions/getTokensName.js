const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

module.exports = {
  name: "$getTokensName",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [separator] = data.inside.splits;

    const defaultSeparator = "\"";
    const currentSeparator = separator && separator.trim() !== "" ? separator : defaultSeparator;

    const method = d.client.AoiSupercell.registerTokenMethod;

    let tokenNames = [];

    if (method === "file") {
      const tokenPath = d.client.AoiSupercell.tokenPath;
      const filePath = join(tokenPath);

      if (!existsSync(filePath)) {
        return d.aoiError.fnError(d, "custom", {}, "Token file does not exist.");
      }

      const tokens = JSON.parse(readFileSync(filePath, "utf8"));
      tokenNames = Object.keys(tokens);
    } else if (method === "index") {
      tokenNames = Object.keys(d.client.AoiSupercell.tokens);
    }

    if (tokenNames.length === 0) {
      return {
        code: d.util.setCode(data),
        result: "No tokens available."
      };
    }

    data.result = tokenNames.join(currentSeparator);

    return {
      code: d.util.setCode(data)
    }
  }
}
