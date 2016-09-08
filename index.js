const cheerio = require('cheerio'),
  escape = require('escape-html'),
  objectComb = require('object-comb'),
  isString = require('lodash.isstring');

module.exports = scrubber;

/**
 * @param {any} obj - Usually a JS object, the thing you want to make sure is escaped.
 * @param {Array.<string>} selectors - CSS selectors of the elements you want to pluck out.
 * 
 * @returns {Object} - object with two keys: `scrubbed` with scrubbed version of output and 
 * `incidents`, an array of escaped strings of offending elements.
 */
function scrubber(obj, selectors=['script', 'iframe']){
  // run function on any key that's a string containing <
  let incidents = [],
    mayBeHtml = val => isString(val) && val.indexOf('<') > -1;

  let scrubHTML = val => {
    // any value that makes it here returned true from mayBeHtml, so it's a string.
    $ = cheerio.load(val);
    selectors.forEach(tag => {
      if ($(tag).length){
        $(tag).each((inx, elem) => {
          incidents.push(escape($(elem).remove().toString()));
        });
      }
    });
    return $.html();
  };

  let scrubbed = objectComb(obj, scrubHTML, mayBeHtml);
  return {scrubbed, incidents};

}