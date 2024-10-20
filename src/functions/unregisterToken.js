const { existsSync, mkdirSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");

const hasInvalidCharacters = (str) => {
  return /\s|[^a-zA-Z0-9_.-]/.test(str);
};

module.exports = {
  name: "$unregisterToken",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [tokenName] = data.inside.splits;

    if (!tokenName || tokenName.trim() === "") {
      return d.aoiError.fnError(d, "custom", {}, "No token name provided.");
    }

    if (hasInvalidCharacters(tokenName)) {
      return d.aoiError.fnError(d, "custom", {}, "The token name contains invalid characters.");
    }

    const method = d.client.AoiSupercell.registerTokenMethod;

    if (method === "file") {
      const tokenPath = d.client.AoiSupercell.tokenPath;

      const dirPath = join(tokenPath, '..');
      const filePath = join(tokenPath);

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      if (!existsSync(filePath)) {
        return d.aoiError.fnError(d, "custom", {}, "Token file does not exist.");
      }

      const tokens = JSON.parse(readFileSync(filePath, "utf8"));

      if (!tokens[tokenName]) {
        return d.aoiError.fnError(d, "custom", {}, `Token '${tokenName}' not found.`);
      }

      delete tokens[tokenName];

      writeFileSync(filePath, JSON.stringify(tokens, null, 2));
    } else {
      return d.aoiError.fnError(d, "custom", {}, "To use this function, you need to be using the 'file' method.");
    }

    return {
      code: d.util.setCode(data)
    };
  },
};
