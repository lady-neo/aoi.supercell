# aoi-supercell
This repository contains a template for creating bots using the Aoi.js library with integration to the Supercell API. The goal of this template is to provide a solid and easy-to-use foundation for developers looking to build custom bots that interact with Brawl Stars data, such as player statistics and match information.

## Setup
If you'd like to create a new project based on this one, follow these steps:
```bash
git clone https://github.com/ladyneo/aoi-brawlapi.git
cd aoi-brawlapi
npm install
```
This will clone the repository, creating a new directory, and installing the aoi.js dependency.

## Registering a Token
First you need to create an account on one of Supercell's APIs.
- [Brawl Stars](https://developer.brawlstars.com/#/getting-started)
- [Clash of Clans](https://developer.clashofclans.com/#/getting-started)
- [Clash Royale](https://developer.clashroyale.com/#/getting-started)
Then you need to access the "My Account" tab.
<div align= "center">
 <img src="img/register-token-1.jpg">
</div>

Now you must create a new key:
<div align="center">
 <img src="img/register-token-2.jpg">
</div>

Now copy the token.
<div align="center">
 <img src="img/register-token-3.jpg">
</div>

After that use the following function:
```php
$registerToken[here-goes-the-name-of-the-token;here-goes-the-token-you-copied]
```

## Functions
Parameters with ? at the end of the name are optional parameters.
- `$registerToken[token-name;token]`
- `$unregisterToken[token-name]`
- `$getTokens[sep?]`
- `$getTokenValue[token-name]`
- `$getPlayerName[game (coc/cr/bs);#PlayerID;token-name]`

<div align="center">
 <img src="img/$getPlayerName-example.jpg">
</div>

- `$getPlayerTrophies[#PlayerID;token-name]`
- `$getPlayerClubName[#PlayerID;token-name]`
- `$getPlayerClubTrophies[#PlayerID;token-name]`
- `$getPlayerClubID[#PlayerID;token-name]`
