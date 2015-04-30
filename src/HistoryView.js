define(function (require, exports, module) {
  const $ = require('jquery');
  const Backbone = require('backbone');
  const currentMedia = require('plug/models/currentMedia');
  const HistoryEntry = require('plug/models/HistoryEntry');
  const Room = require('plug/models/Room');
  const Media = require('plug/models/Media');
  const util = require('plug/util/util');
  const HistoryPanelView = require('./HistoryPanelView');

  function toInt(el) {
    return parseInt(el.find('span').text().trim(), 10);
  }

  function getHistory(user, cb) {
    if (user.get('slug')) {
      next(user.get('slug'));
    }
    else if (user.get('level') >= 5) {
      new UserFindAction(user.id)
        .on('success', user => {
          if (!user.get('slug')) return;
          next(user.get('slug'));
        })
    }

    function next(slug) {
      $.get(`https://plug.dj/@/${user.get('slug')}`, parseProfileBody);
    }
    function parseProfileBody(body) {
      // get the actual body, without all the link and script tags
      let bodyStart = body.indexOf('<body>');
      let bodyEnd = body.indexOf('</body>', bodyStart + 1);
      body = body.substring(bodyStart + 6, bodyEnd);
      // prevent the browser from trying to load all the youtube images
      // already
      body = body.replace(/img src=/g, 'img data-src=');
      let history = [];
      $('.row', body).each(function () {
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
            cid: image.match(/\/([a-zA-Z0-9_\-]{11,})\//)[1]
          });
        }
        else {
          // soundcloud video, we can't really extract the ID properly
          media.set({ format: 2 });
        }
        let he = new HistoryEntry({
          user: user,
          media: media,
          room: {
            name: el.find('.name').text().trim()
          },
          timestamp: util.convertUnixDateStringToNumberString(el.find('.timestamp').text().trim()),
          score: {
            positive: toInt(el.find('.score .positive')),
            negative: toInt(el.find('.score .negative')),
            curates: toInt(el.find('.score .grabs')),
            listeners: toInt(el.find('.score .listeners'))
          }
        });
        history.push(he);
      });
      cb(null, history);
    }
  }

  const HistoryView = Backbone.View.extend({
    id: 'extplug-user-profiles-history',
    className: 'user-content',
    initialize: function () {
      this.history = new Backbone.Collection();
      if (this.model) {
        getHistory(this.model, (e, history) => {
          this.history.reset(history);
        });
      }
    },
    render: function () {
      if (this.model.get('level') < 5) {
        this.$el.append(`
          You can only view the history of users above level 5,
          but ${this.model.get('username')} is only level
          ${this.model.get('level')}.
        `);
        return this;
      }
      this.list = new HistoryPanelView({ collection: this.history });
      this.$el.append(this.list.$el);
      this.list.render();
      return this;
    },
    onResize: function (e) {
    },
    remove: function () {
      this.list.destroy();
      this.list = null;
      this._super();
    }
  });

  module.exports = HistoryView;

});
