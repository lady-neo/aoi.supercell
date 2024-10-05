const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const [separator] = data.inside.splits;

  const defaultSeparator = "\"";
  const currentSeparator = separator && separator.trim() !== "" ? separator : defaultSeparator;

  const filePath = join(process.cwd(), "./src/config/.tokens.json");

  if (!existsSync(filePath)) {
    return d.aoiError.fnError(d, "custom", {}, "Token file does not exist.");
  }

  const tokens = JSON.parse(readFileSync(filePath, "utf8"));
  const tokenNames = Object.keys(tokens);

  if (tokenNames.length === 0) {
    return {
      code: d.util.setCode(data),
      result: "No tokens available."
    };
  }

  data.result = tokenNames.join(currentSeparator);

  return {
    code: d.util.setCode(data)
  };
};
