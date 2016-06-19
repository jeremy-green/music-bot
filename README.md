# Music Bot

### Prerequisites

You will need to have following software and versions:

`node v5.0.0`

`npm v3.3.10`

Or at least a version of Node.js that can run ES6.

### Installation

Clone the repo

`git clone git@github.com:jeremy-green/music-bot.git`

Change directories into the repo

`cd music-bot`

Install the dependencies

`npm install`

Rename the `default.sample.json` file to `default.json` and add your Slack token.

Run your bot with `node bot.js` and it should come online.

If your bot keeps having it's RTM closed by Slack, install [Forever](https://github.com/foreverjs/forever).

Run your bot with Forever: `forever bot.js`.
