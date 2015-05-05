define(function (require, exports, module) {

  const $ = require('jquery');
  const { Collection } = require('backbone');
  const UserFindAction = require('plug/actions/users/UserFindAction');
  const util = require('plug/util/util');
  const Media = require('plug/models/Media');
  const HistoryEntry = require('plug/models/HistoryEntry');
  const request = require('extplug/util/request');

  // ensures that the user object has a "slug" property
  function fetchSlug(user) {
    return $.Deferred(d => {
      if (user.get('slug')) {
        return d.resolve(user);
      }
      if (user.get('level') < 5) {
        return d.reject(new Error('User is below level 5 and ' +
                                  'doesn\'t have a profile page.'));
      }
      new UserFindAction(user.get('id'))
        .on('success', data => {
          user.set(data);
          d.resolve(user);
        })
        .on('error', d.reject);
    });
  }

  // gets the HTML contents of a user profile page
  function fetchPage(user) {
    return request(`https://plug.dj/@/${user.get('slug')}`);
  }

  // parses a user profile page into a "blurb" and a DJ history collection
  const toInt = el => parseInt(el.find('span').text().trim(), 10);
  function parse(user, body) {
    // get the actual body, without all the link and script tags
    let bodyStart = body.indexOf('<body>');
    let bodyEnd = body.indexOf('</body>', bodyStart + 1);
    body = body.substring(bodyStart + 6, bodyEnd);
    // prevent the browser from trying to load all the thumbnail images
    // already
    body = body.replace(/img src=/g, 'img data-src=');
    let blurb = util.cleanTypedString($('.blurb .box', body).html().trim());
    let history = parseHistory(user, body);
    return user.set({ blurb, history });
  }
  function parseHistory(user, body) {
    let history = $('.row', body).map(function () {
      let el = $(this);
      let [ author, ...title ] = el.find('.author').text().split(' - ');
      let image = el.find('img[data-src]').data('src')
      let media = new Media({
        author: author.trim(),
        title: title.join(' - ').trim(),
        image: image
      });
      if (image.indexOf('ytimg') !== -1) {
        media.set({
          format: 1,
          // extract video id
          cid: (image.match(/\/([a-zA-Z0-9_\-]{11,})\//) || [''])[1]
        });
      }
      else {
        // soundcloud video, we can't really extract the ID properly
        media.set({ format: 2 });
      }
      return new HistoryEntry({
        user: user,
        media: media,
        room: { name: el.find('.name').text().trim() },
        timestamp: util.convertUnixDateStringToNumberString(el.find('.timestamp').text().trim()),
        score: {
          positive:  toInt(el.find('.score .positive')),
          negative:  toInt(el.find('.score .negative')),
          curates:   toInt(el.find('.score .grabs')),
          listeners: toInt(el.find('.score .listeners'))
        }
      });
    });
    return new Collection(history.toArray());
  }

  // gets full user profile info, including slug, blurb and play history
  function getProfileInfo(user) {
    return fetchSlug(user)
      .then(fetchPage)
      .then(body => parse(user, body))
  }

  module.exports = getProfileInfo;

});
