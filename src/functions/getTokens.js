const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

const hasInvalidCharacters = (str) => {
  return /\s|[^a-zA-Z0-9_.-]/.test(str);
};

module.exports = {
  name: "$getTokens",
  type: "djs",
  code: async (d) => {
  const data = d.util.aoiFunc(d);
  const [tokenName] = data.inside.splits;

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

  const tokenValue = tokens[tokenName];

  if (tokenValue === undefined) {
    return d.aoiError.fnError(d, "custom", {}, `No token found with the name '${tokenName}'.`);
  }

  data.result = tokenValue;

  return {
    code: d.util.setCode(data)
  }
};
}
