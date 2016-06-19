'use strict';

// package modules
const Botkit = require('botkit');
const config = require('config');

// custom modules
const game = require('./lib/game');

// config
const token = config.token;

if (!token) {
  console.log('No Token');
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: config.debug
});

const bot = controller.spawn({
  token: token
}).startRTM();

controller.hears([
  'begin',
  'start'
], [
  'direct_message'
], game.start);

controller.hears([
  'help'
], [
  'direct_message'
], game.help);

controller.on([
  'rtm_close'
], () => {
  console.log('rtm_close');

  setTimeout(() => {
    console.log('restarting');
    process.exit(0);
  }, config.restartTimeout);
});
