'use strict';

/**
 * ATTENTION! For working this module lib "ffmpeg" installed needed.
 * 
 * Parsing some .mp3-file data, like a bitrate, duration and size
 *
 * Using:
 * node-ffprobe('path to file', function (error, parsedData) { ... });
 */

const spawn = require('child_process').spawn;

module.exports = (function() {
  function findBlocks (raw) {
    let format_start = raw.indexOf('[FORMAT]') + 8,
        format_end = raw.lastIndexOf('[/FORMAT]');

    let blocks = null;

    if (format_start !== 7 && format_end !== -1) 
      blocks = raw.slice(format_start, format_end).trim();

    return blocks;
  }

  function parseField (str) {
    str = ("" + str).trim();

    return str.match(/^\d+\.?\d*$/) ? parseFloat(str) : str;
  }

  function parseBlock (block) {
    let block_object = {};
    let lines = block.split('\n');

    lines.forEach(line => {
      let data = line.split('=');

      if (data && data.length === 2) 
        block_object[data[0]] = parseField(data[1]);
    });

    return block_object;
  }

  function parseFormat (text) {
    if (!text) 
      return null;

    let block = text.replace('[FORMAT]\n', '').replace('[/FORMAT]', '');
    let raw_format = parseBlock(block);
    let format = {};

    // remove some data
    delete raw_format.filename;
    delete raw_format.nb_streams;
    delete raw_format.format_name;
    delete raw_format.format_long_name;
    delete raw_format.start_time;

    for (let attr in raw_format) {
      if (raw_format.hasOwnProperty(attr) && attr.indexOf('TAG') === -1) 
        format[attr] = raw_format[attr];
    }

    return format;
  }

  function doProbe (file, callback) {
    // Using "ffprobe" lib for parsing .mp3-file data
    let proc = spawn('ffprobe', ['-show_streams', '-show_format', '-loglevel', 'warning', file]);
    let probeData = [];
    let errData = [];
    let exitCode = null;

    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');

    proc.stdout.on('data', (data) => probeData.push(data));
    proc.stderr.on('data', (data) => errData.push(data));
    proc.on('exit', (code) => {
      exitCode = code;
    });

    proc.on('close', () => {
      let blocks = findBlocks(probeData.join(''));
      let fileData = parseFormat(blocks);

      if (exitCode) 
        return callback(errData.join(''));

      callback(null, fileData);
    });
  }

  return doProbe;
})();