'use strict';

const fs      = require('fs');
const path    = require('path');

const request = require('request');
const config  = require('config');

module.exports = {
  /**
   * Upload an image to Slack directly
   * @example
   * requests.uploadFile(message, './bender-smoking.jpg', 'Bender smoking a cigar');
   * @param  {Object} message  The message object
   * @param  {String} filepath The filepath
   * @param  {String} comment  An optional comment
   */
  uploadFile(message, filepath, cb, comment) {
    const r    = request.post('https://slack.com/api/files.upload', cb);
    const form = r.form();
    const p    = path.parse(filepath);

    if (comment) {
      form.append('initial_comment', comment);
    }

    form.append('token', config.token);
    form.append('filename', new Buffer(p.name).toString('base64'));
    form.append('channels', message.channel);
    form.append('file', fs.createReadStream(filepath));
  }
};
