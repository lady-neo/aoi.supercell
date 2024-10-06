const { existsSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");

const hasInvalidCharacters = (str) => {
  return /\s|[^a-zA-Z0-9_.-]/.test(str);
};

module.exports = {
  name: "$unregisterToken",
  type: "djs",
  code: async (d) => {
  const data = d.util.aoiFunc(d);
  let [tokenName] = data.inside.splits;

  if (!tokenName || tokenName.trim() === "") {
    return d.aoiError.fnError(d, "custom", {}, "No token name provided.");
  }

  if (hasInvalidCharacters(tokenName)) {
    return d.aoiError.fnError(d, "custom", {}, "The token name contains invalid characters.");
  }

  const filePath = join(process.cwd(), "./src/config/.tokens.json");

  if (!existsSync(filePath)) {
    return d.aoiError.fnError(d, "custom", {}, "Token file does not exist.");
  }

  const tokens = JSON.parse(readFileSync(filePath, "utf8"));

  if (!tokens[tokenName]) {
    return d.aoiError.fnError(d, "custom", {}, `Token '${tokenName}' not found.`);
  }

  delete tokens[tokenName];

  writeFileSync(filePath, JSON.stringify(tokens, null, 2));

  return {
    code: d.util.setCode(data)
  }
};
}
