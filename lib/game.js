'use strict';

const _ = require('lodash');
const config = require('config');

const requests = require('./requests');

const getNotes = () => {
  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  let notes = [
    'e-0',
    'f-0',
    'g-0',
    'f-7',
    'g-7',
    'a-7'
  ];

  for (var i = 1; i < 7; i++) {
    for (var j = 0, len = letters.length; j < len; j++) {
      notes.push(letters[j] + '-' + i);
    }
  }

  return _.shuffle(notes);
};

const showCard = (bot, message, convo, notes) => {
  const note = notes.shift();
  notes.push(note);

  let body;
  let file;
  let answered = false;
  let callbackTimeout;

  requests.uploadFile(message, `./assets/${note}.png`, (e, r, b) => {
    body = JSON.parse(b);
    file = body.file;
  });

  convo.ask('', [
    {
      pattern: note.split('-')[0],
      callback: (response, convo) => {
        if (answered) { return; }
        answered = true;

        bot.api.reactions.add({
          timestamp: response.ts,
          token: config.token,
          channel: message.channel,
          name: 'white_check_mark'
        }, (err, res) => {
          callbackTimeout = setTimeout(() => {
            convo.next();
            showCard(bot, message, convo, notes);
          }, config.gameTimeout);
        });
      }
    },
    {
      pattern: 'end|stop|exit',
      callback: (response, convo) => {
        clearTimeout(callbackTimeout);
        convo.say('Ok, bye');
        convo.next();
      }
    },
    {
      default: true,
      callback: (response, convo) => {
        if (answered) { return; }
        answered = true;

        bot.api.reactions.add({
          timestamp: response.ts,
          token: config.token,
          channel: message.channel,
          name: 'no_entry_sign'
        }, (err, res) => {
          callbackTimeout = setTimeout(() => {
            convo.next();
            showCard(bot, message, convo, notes);
          }, config.gameTimeout);
        });
      }
    }
  ]);
};

module.exports = {
  start(bot, message) {
    bot.startPrivateConversation(message, (err, convo) => {
      convo.sayFirst('Let\'s begin.');
      let notes = getNotes();
      showCard(bot, message, convo, notes);
    });
  },
  help(bot, message) {
    let mins = config.gameTimeout/1000/60;
    let str = 'minute';
    if (mins > 1) {
      str += 's';
    }

    bot.reply(message, `
Hi there. I'm here to teach you how to read music notes.
I will show you a new card every ${mins} ${str}.
Type in the letter of the note you think matches the card.
If you are correct, I will respond with :white_check_mark:.
If you missed it, I will respond with :no_entry_sign:.
To begin, just tell me *begin* or *start*.
To end your game, just tell me *stop* or *end*.
    `);
  }
};
