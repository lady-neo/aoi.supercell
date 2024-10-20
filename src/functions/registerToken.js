const { existsSync, mkdirSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");

const hasInvalidCharacters = (str) => {
  return /\s|[^a-zA-Z0-9_.-]/.test(str);
};

module.exports = {
  name: "$registerToken",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [tokenName, token] = data.inside.splits;

    if (!tokenName || tokenName.trim() === "") {
      return d.aoiError.fnError(d, "custom", {}, "No token name provided.");
    }

    if (!token || token.trim() === "") {
      return d.aoiError.fnError(d, "custom", {}, "No token provided.");
    }

    if (hasInvalidCharacters(tokenName)) {
      return d.aoiError.fnError(d, "custom", {}, "The token name contains invalid characters.");
    }

    if (hasInvalidCharacters(token)) {
      return d.aoiError.fnError(d, "custom", {}, "The token value contains invalid characters.");
    }

    const method = d.client.AoiSupercell.registerTokenMethod;

    if (method === "file") {
      if (d.client.AoiSupercell.registerTokenMethod !== "file") {
        return d.aoiError.fnError(d, "custom", {}, "Token registration method is not 'file");
      }

      const tokenPath = d.client.AoiSupercell.tokenPath;

      if (!tokenPath) {
        return d.aoiError.fnError(d, "custom", {}, "No token path configured.");
      }

      const dirPath = join(tokenPath, '..');
      const filePath = join(tokenPath);

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      if (!existsSync(filePath)) {
        writeFileSync(filePath, JSON.stringify({}, null, 2));
      }

      const tokens = JSON.parse(readFileSync(filePath, "utf8"));

      const existingTokenName = Object.keys(tokens).find(name => tokens[name] === token);
      if (existingTokenName) {
        return d.aoiError.fnError(d, "custom", {}, `A token with the value '${token}' is already registered as '${existingTokenName}'. Please use a different value.`);
      }

      if (tokens[tokenName] !== undefined) {
        return d.aoiError.fnError(d, "custom", {}, `The token name '${tokenName}' is already in use. Please choose a different name.`);
      }

      tokens[tokenName] = token;

      writeFileSync(filePath, JSON.stringify(tokens, null, 2));
    } else {
      return d.aoiError.fnError(d, "custom", {}, "To use this function, you need to be using the 'file' method.");
    }

    return {
      code: d.util.setCode(data)
    };
  },
};
