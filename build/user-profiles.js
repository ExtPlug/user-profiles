

define('extplug/user-profiles/MenuView',['require','exports','module','jquery','underscore','plug/core/Events','plug/events/AlertEvent','plug/util/AvatarManifest','lang/Lang','plug/views/users/menu/UserMenuView','extplug/util/Style'],function (require, exports, module) {
  var $ = require('jquery');
  var _ = require('underscore');
  var Events = require('plug/core/Events');
  var AlertEvent = require('plug/events/AlertEvent');
  //  var currentUser = require('f3ecc/d813f/a062a');
  //  var BefriendAction = require('f3ecc/a67a5/c3ae3/e62c4');
  //  var UnfriendAction = require('f3ecc/a67a5/c3ae3/ab103');
  var AvatarManifest = require('plug/util/AvatarManifest');
  var Lang = require('lang/Lang');
  var UserMenuView = require('plug/views/users/menu/UserMenuView');
  var Style = require('extplug/util/Style');
  var ProfileMenuView = UserMenuView.extend({
    id: 'extplug-user-profiles-menu',
    initialize: function initialize() {
      this._super();
      this.onPress = this.onPress.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onAvatarChange = this.onAvatarChange.bind(this);
    },
    render: function render() {
      this.$el.html('\n        <div class="avatar"></div>\n        <div class="item profile" data-value="profile">\n          <i class="icon icon-user-grey"></i>\n          <span class="label">' + Lang.userFriends.profile + '</span>\n        </div>\n        <div class="item played" data-value="played">\n          <i class="icon icon-history-grey"></i>\n          <span class="label">' + Lang.userMenu.played + '</span>\n        </div>\n      ');
      this.$avatar = this.$('.avatar').on('mousedown', this.onPress);
      this.$('.item').on('click', this.onClick);
      this.onAvatarChange();
      return this;
    },
    onAvatarChange: function onAvatarChange() {
      this.$avatar.empty();
      this.$img.attr('src', AvatarManifest.getAvatarUrl(this.model.get('avatarID'), 'b'));
      this.$avatar.append(this.$img);
      this.aviW = 220;
      this.aviO = 0;
      this.model.get('avatarID').indexOf('dragon') > -1 && (this.aviO = -8, this.aviW = 440);
    }
  });

  return ProfileMenuView;
});


define('extplug/user-profiles/MetaView',['require','exports','module','plug/views/users/profile/MetaView','lang/Lang'],function (require, exports, module) {

  var Base = require('plug/views/users/profile/MetaView');
  var Lang = require('lang/Lang');

  /**
   * A version of the profile MetaView without Blurb editing.
   */
  var MetaView = Base.extend({

    render: function render() {
      this._super();
      // remove blurb edit events again
      this.$('.blurb .box').off();
      return this;
    },

    onChange: function onChange() {
      // if the blurb is empty, plug.dj defaults to "Click here (...)".
      // we don't really want that because you cannot, in fact, change someone
      // else's blurb.
      var blurb = Lang.userPanel.blurb;
      // so we'll default to the empty string instead!
      Lang.userPanel.blurb = '';
      var res = this._super();
      Lang.userPanel.blurb = blurb;
      return res;
    }

  });

  module.exports = MetaView;
});


define('extplug/user-profiles/ProfileView',['require','exports','module','jquery','backbone','./MetaView'],function (require, exports, module) {
  var $ = require('jquery');

  var _require = require('backbone');

  var View = _require.View;

  var MetaView = require('./MetaView');

  var ProfileView = View.extend({
    className: 'user-content profile',
    render: function render() {
      this.meta = new MetaView({ model: this.model });
      this.$container = $('<div />').addClass('container');
      this.$container.append(this.meta.$el);
      this.$el.append(this.$container);
      this.meta.render();
      this.$container.jScrollPane();
      this.scrollPane = this.$container.data('jsp');
      return this;
    },
    onResize: function onResize(e) {},
    remove: function remove() {
      this.scrollPane && this.scrollPane.destroy();
      this.meta.destroy();
      this.$container.remove();
      this.scrollPane = null;
      this.meta = null;
      this.$container = null;
      this._super();
    }
  });

  module.exports = ProfileView;
});


define('extplug/user-profiles/HistoryView',['require','exports','module','jquery','backbone','plug/views/playlists/media/panels/UserHistoryPanelView'],function (require, exports, module) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var HistoryPanelView = require('plug/views/playlists/media/panels/UserHistoryPanelView');

  var HistoryView = Backbone.View.extend({
    id: 'extplug-user-profiles-history',
    className: 'user-content',
    render: function render() {
      if (this.model.get('level') < 5) {
        this.$el.append('\n          You can only view the history of users above level 5,\n          but ' + this.model.get('username') + ' is only level\n          ' + this.model.get('level') + '.\n        ');
        return this;
      }
      this.list = new HistoryPanelView({ collection: this.model.get('history') });
      this.$el.append(this.list.$el);
      this.list.render();
      return this;
    },
    onResize: function onResize(e) {},
    remove: function remove() {
      this.list.destroy();
      this.list = null;
      this._super();
    }
  });

  module.exports = HistoryView;
});


define('extplug/user-profiles/UserView',['require','exports','module','plug/views/users/UserView','plug/core/Events','extplug/util/getUserClasses','./MenuView','./ProfileView','./HistoryView','jquery'],function (require, exports, module) {

  var UserView = require('plug/views/users/UserView');
  var Events = require('plug/core/Events');
  var getUserClasses = require('extplug/util/getUserClasses');
  var MenuView = require('./MenuView');
  var ProfileView = require('./ProfileView');
  var HistoryView = require('./HistoryView');
  var $ = require('jquery');

  var UserProfileView = UserView.extend({
    id: 'extplug-user-profiles',

    initialize: function initialize() {
      this.resizeBind = this.onResize.bind(this);
      this.showBind = this.onShow.bind(this);
      this.hideBind = this.onHide.bind(this);
      this.showing = false;
    },

    render: function render() {
      this.$el.empty().removeClass().addClass('app-left').addClass(getUserClasses(this.model.get('id')).join(' '));
      this.menu = new MenuView({ model: this.model });
      this.menu.render();
      this.menu.on('change:section', this.change, this);
      this.$el.append(this.menu.$el);
      return this;
    },

    change: function change(section) {
      this.clear();
      this.section = section;
      if (section === 'profile') {
        this.view = new ProfileView({ model: this.model });
      } else if (section === 'played') {
        this.view = new HistoryView({ model: this.model });
      }
      this.$el.append(this.view.$el);
      this.view.render();
    },

    onShow: function onShow() {
      $('#footer-user').addClass('showing');
      Events.once('hide:user', this.hide, this);
      this._super();
    },
    onHide: function onHide() {
      $('#footer-user').removeClass('showing');
      this._super();
    }

  });

  module.exports = UserProfileView;
});


function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

define('extplug/user-profiles/profile-info',['require','exports','module','jquery','backbone','plug/actions/users/UserFindAction','plug/util/util','plug/models/Media','plug/models/HistoryEntry','extplug/util/request'],function (require, exports, module) {

  var $ = require('jquery');

  var _require = require('backbone');

  var Collection = _require.Collection;

  var UserFindAction = require('plug/actions/users/UserFindAction');
  var util = require('plug/util/util');
  var Media = require('plug/models/Media');
  var HistoryEntry = require('plug/models/HistoryEntry');
  var request = require('extplug/util/request');

  // ensures that the user object has a "slug" property
  function fetchSlug(user) {
    return $.Deferred(function (d) {
      if (user.get('slug')) {
        return d.resolve(user);
      }
      if (user.get('level') < 5) {
        return d.reject(new Error('User is below level 5 and ' + 'doesn\'t have a profile page.'));
      }
      new UserFindAction(user.get('id')).on('success', function (data) {
        user.set(data);
        d.resolve(user);
      }).on('error', d.reject);
    });
  }

  // gets the HTML contents of a user profile page
  function fetchPage(user) {
    return request('https://plug.dj/@/' + user.get('slug'));
  }

  // retrieves a room URL slug from a link
  function getRoomSlug() {
    var href = arguments[0] === undefined ? '' : arguments[0];

    var parts = href.split('/');
    // one .pop() for "plug.dj/room-slug", two .pop()s for "plug.dj/room-slug/"
    return parts.pop() || parts.pop();
  }

  // parses a user profile page into a "blurb" and a DJ history collection
  var toInt = function toInt(el) {
    return parseInt(el.find('span').text().trim(), 10);
  };
  function parse(user, body) {
    // get the actual body, without all the link and script tags
    var bodyStart = body.indexOf('<body>');
    var bodyEnd = body.indexOf('</body>', bodyStart + 1);
    body = body.substring(bodyStart + 6, bodyEnd);
    // prevent the browser from trying to load all the thumbnail images
    // already
    body = body.replace(/img src=/g, 'img data-src=');
    var blurb = util.cleanTypedString($('.blurb .box', body).html().trim());
    var history = parseHistory(user, body);
    return user.set({ blurb: blurb, history: history });
  }
  function parseHistory(user, body) {
    var history = $('.row', body).map(function () {
      var el = $(this);

      var _el$find$text$split = el.find('.author').text().split(' - ');

      var _el$find$text$split2 = _toArray(_el$find$text$split);

      var author = _el$find$text$split2[0];

      var title = _el$find$text$split2.slice(1);

      var image = el.find('img[data-src]').data('src');
      var media = new Media({
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
      } else {
        // soundcloud video, we can't really extract the ID properly
        media.set({ format: 2 });
      }
      var slug = getRoomSlug(el.find('.meta a').attr('href'));
      return new HistoryEntry({
        user: user,
        media: media,
        room: {
          name: el.find('.name').text().trim(),
          slug: slug
        },
        timestamp: util.convertUnixDateStringToNumberString(el.find('.timestamp').text().trim()),
        score: {
          positive: toInt(el.find('.score .positive')),
          negative: toInt(el.find('.score .negative')),
          grabs: toInt(el.find('.score .grabs')),
          // convert to string because plug defaults to the current audience
          // size if the listeners count is falsy and a string "0" is not falsy
          listeners: '' + toInt(el.find('.score .listeners'))
        }
      });
    });
    return new Collection(history.toArray());
  }

  // gets full user profile info, including slug, blurb and play history
  function getProfileInfo(user) {
    return fetchSlug(user).then(fetchPage).then(function (body) {
      return parse(user, body);
    });
  }

  module.exports = getProfileInfo;
});


define('extplug/user-profiles/style',['require','exports','module'],function (require, exports, module) {

  return {
    '#extplug-user-profiles': {
      'background': '#111317',
      'z-index': '500',
      '.user-content': {
        'position': 'absolute',
        'top': '0',
        'height': '100%' },

      '.profile': {
        '.container': {
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'width': '100%',
          'height': '100%',

          // hide Points and Subscribe buttons, since
          // they always show the current user's data
          '.meta .points': { 'display': 'none' }
        }
      }
    },

    '#extplug-user-profiles-menu': {
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'max-width': '220px',
      'width': '22%',
      'height': '100%',
      'background': '#1c1f25',

      '.avatar': {
        'position': 'relative',
        'overflow': 'hidden',
        'width': '100%',
        'height': '250px',
        'background': 'linear-gradient(to bottom, #535d80 0, #32324d 56%, #1a1a1a 73%, #73716d 100%)'
      },
      '.item': {
        'position': 'relative',
        'width': '100%',
        'height': '46px',
        'cursor': 'pointer'
      },
      '.item.selected': {
        'background': '#32234c',
        'cursor': 'default'
      },
      '.item i': {
        'top': '8px',
        'left': '5px'
      },
      '.item .label': {
        'position': 'absolute',
        'top': '12px',
        'left': '40px',
        'font-size': '16px'
      }
    },

    // make sure user profile links have the same colour as they would be
    // without links, but do underline them to clarify "clickability" :>
    '.extplug-user-profiles-link': {
      'color': 'inherit',
      'text-decoration': 'underline'
    }
  };
});


define('extplug/user-profiles/main',['require','exports','module','jquery','meld','extplug/Plugin','plug/actions/users/UserFindAction','plug/models/User','plug/collections/users','plug/views/users/userRolloverView','plug/views/rooms/users/FriendRowView','./UserView','./profile-info','./style'],function (require, exports, module) {

  var $ = require('jquery');

  var _require = require('meld');

  var after = _require.after;

  var Plugin = require('extplug/Plugin');
  var UserFindAction = require('plug/actions/users/UserFindAction');
  var User = require('plug/models/User');
  var users = require('plug/collections/users');
  var rolloverView = require('plug/views/users/userRolloverView');
  var FriendRowView = require('plug/views/rooms/users/FriendRowView');

  var UserView = require('./UserView');
  var getProfileInfo = require('./profile-info');
  var style = require('./style');

  module.exports = Plugin.extend({
    name: 'User Profiles',

    style: style,

    enable: function enable() {
      var _this = this;

      this.linkAdvice = after(rolloverView, 'showSimple', function () {
        var username = $('#user-rollover .username');
        if (rolloverView.user.get('level') >= 5) {
          var usernameText = username.text();
          username.empty().append($('<a />').addClass('extplug-user-profiles-link').attr('href', 'javascript:void 0;').text(usernameText).on('click', function () {
            _this.showProfile(rolloverView.user.get('id'));
            rolloverView.cleanup();
          }));
        }
      });
      var userProfiles = this;
      this.friendsAdvice = after(FriendRowView.prototype, 'render', function () {
        var _this2 = this;

        var username = this.$('.name');
        if (this.model.get('level') >= 5) {
          var usernameText = username.text();
          username.empty().append($('<a />').addClass('extplug-user-profiles-link').attr('href', 'javascript:void 0;').text(usernameText).on('click', function () {
            userProfiles.showProfile(_this2.model.get('id'));
          }));
        }
      });
    },

    disable: function disable() {
      this.linkAdvice.remove();
      if (this.userView) {
        this.userView.destroy();
      }
      this.userView = null;
      this._super();
    },

    showProfile: function showProfile(id) {
      var _this3 = this;

      var show = function show(user) {
        getProfileInfo(user).then(function (user) {
          if (_this3.userView) {
            _this3.userView.model = user.clone();
            _this3.userView.render();
          } else {
            _this3.userView = new UserView({ model: user.clone() });
            _this3.userView.render();
            _this3.userView.$el.appendTo('body');
          }
          _this3.userView.show('profile');
        });
      };
      if (users.get(id)) {
        show(users.get(id));
      } else {
        new UserFindAction(id).on('success', function (user) {
          return show(new User(user));
        });
      }
    }
  });
});
