const { existsSync, readFileSync } = require("fs");
const { join } = require("path");
const { fetch } = require("undici");
const agent = require("../config/agent.js");

module.exports = {
  name: "$getPlayerClubName",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [id, tokenName] = data.inside.splits;

    if (!id || id.trim() === "") {
      return d.aoiError.fnError(d, "custom", {}, "No player ID provided.");
    }

    if (!tokenName || tokenName.trim() === "") {
      return d.aoiError.fnError(d, "custom", {}, "No token name provided.");
    }

    const idRegex = /^#[A-Za-z0-9]+$/;
    if (!idRegex.test(id.trim())) {
      return d.aoiError.fnError(d, "custom", {}, "Invalid player ID. The ID must start with '#'.");
    }

    const method = d.client.AoiSupercell.registerTokenMethod;
    let tokenValue;

    if (method === "file") {
      const tokenPath = d.client.AoiSupercell.tokenPath;
      const filePath = join(process.cwd(), tokenPath);

      if (!existsSync(filePath)) {
        return d.aoiError.fnError(d, "custom", {}, "Token file does not exist.");
      }

      const tokens = JSON.parse(readFileSync(filePath, "utf8"));
      tokenValue = tokens[tokenName];

      if (tokenValue === undefined) {
        return d.aoiError.fnError(d, "custom", {}, `No token found with the name '${tokenName}'.`);
      }
    } else if (method === "index") {
      tokenValue = d.client.AoiSupercell.tokens[tokenName];

      if (tokenValue === undefined) {
        return d.aoiError.fnError(d, "custom", {}, `No token found with the name '${tokenName}'.`);
      }
    } else {
      return d.aoiError.fnError(d, "custom", {}, "Invalid token registration method.");
    }

    try {
      const response = await fetch(`https://api.brawlstars.com/v1/players/%23${id.slice(1)}`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`
        },
        agent: agent
      });

      if (!response.ok) {
        console.error(
          "\x1b[37m%s\x1b[36m%s\x1b[37m%s\x1b[0m \x1b[31m%s\x1b[0m: %s",
          "[", "aoi.brawlapi", "]",
          "Network response error",
          response.statusText,
          response.status,
          response.url
        );
        return d.aoiError.fnError(d, "custom", {}, "Failed to retrieve player club name. Please check the ID and token.");
      }

      const playerData = await response.json();
      const playerClubName = playerData.club ? playerData.club.name : "No club found";

      data.result = playerClubName;

      return {
        code: d.util.setCode(data)
      };
    } catch (error) {
      return d.aoiError.fnError(d, "custom", {}, "Failed to retrieve player club name. Please check the ID and token.");
    }
  }
};
