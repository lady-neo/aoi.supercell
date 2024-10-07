const { existsSync, readFileSync } = require("fs");
const { join } = require("path");
const { fetch } = require("undici");
const agent = require("../config/agent.js");

module.exports = {
  name: "$getPlayerName",
  type: "djs",
  code: async (d) => {
    const data = d.util.aoiFunc(d);
    const [game, id, tokenName] = data.inside.splits;

    if (!game || game.trim() === "") {
      return d.aoiError.fnError(d, "custom", {}, "No game provided.");
    }

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

    const filePath = join(process.cwd(), "./src/config/.tokens.json");

    if (!existsSync(filePath)) {
      return d.aoiError.fnError(d, "custom", {}, "Token file does not exist.");
    }

    const tokens = JSON.parse(readFileSync(filePath, "utf8"));
    const tokenValue = tokens[tokenName];

    if (tokenValue === undefined) {
      return d.aoiError.fnError(d, "custom", {}, `No token found with the name '${tokenName}'.`);
    }

    let apiUrl;
    if (game.toLowerCase() === "bs") {
      apiUrl = `https://api.brawlstars.com/v1/players/%23${id.slice(1)}`;
    } else if (game.toLowerCase() === "cr") {
      apiUrl = `https://api.clashroyale.com/v1/players/%23${id.slice(1)}`;
    } else if (game.toLowerCase() === "coc") {
      apiUrl = `https://api.clashofclans.com/v1/players/%23${id.slice(1)}`;
    } else {
      return d.aoiError.fnError(d, "custom", {}, "Invalid game specified. Use 'bs' for Brawl Stars, 'cr' for Clash Royale, or 'coc' for Clash of Clans.");
    }

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${tokenValue}`
        },
        agent: agent
      });

      if (!response.ok) {
        console.error(
          "\x1b[37m%s\x1b[36m%s\x1b[37m%s\x1b[0m \x1b[31m%s\x1b[0m: %s",
          "[", "aoi.api", "]",
          "Network response error",
          response.statusText,
          response.status,
          response.url
        );
        return d.aoiError.fnError(d, "custom", {}, "Failed to retrieve player name. Please check the ID and token.");
      }

      const playerData = await response.json();
      const playerName = playerData.name;

      data.result = playerName;

      return {
        code: d.util.setCode(data)
      };
    } catch (error) {
      return d.aoiError.fnError(d, "custom", {}, "Failed to retrieve player name. Please check the ID and token.");
    }
  }
}
