

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
      this.$el.html('\n        <div class="avatar"></div>\n        <div class="item profile" data-value="profile">\n          <i class="icon icon-user-grey"></i>\n          <span class="label">' + Lang.userFriends.profile + '</span>\n        </div>\n        <div class="item played" data-value="played">\n          <i class="icon icon-history-grey"></i>\n          <span class="label">' + Lang.userMenu.played + '</span>\n        </div>\n        <div class="item community" data-value="community">\n          <i class="icon icon-community-grey"></i>\n          <span class="label">' + Lang.appMenu.communities + '</span>\n        </div>\n      ');
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

  function copyStyles(el, props) {
    var style = window.getComputedStyle($(el)[0]);
    return props.reduce(function (obj, prop) {
      obj[prop] = style.getPropertyValue(prop);
      return obj;
    }, {});
  }

  ProfileMenuView._style = new Style({
    '#extplug-user-profiles-menu': {
      position: 'absolute',
      top: '0',
      left: '0',
      'max-width': '220px',
      width: '22%',
      height: '100%',
      background: '#1c1f25',

      '.avatar': copyStyles('#user-menu .avatar', ['position', 'overflow', 'width', 'height', 'background']),
      '.item': copyStyles('#user-menu .item:not(.selected)', ['position', 'width', 'height', 'cursor']),
      '.item.selected': {
        background: '#32234c',
        cursor: 'default'
      },
      '.item i': copyStyles('#user-menu .item i', ['top', 'left']),
      '.item .label': copyStyles('#user-menu .item .label', ['position', 'top', 'left', 'font-size'])
    }
  });

  return ProfileMenuView;
});


define('extplug/user-profiles/ProfileView',['require','exports','module','jquery','backbone','plug/views/users/profile/MetaView','extplug/util/Style'],function (require, exports, module) {
  var $ = require('jquery');

  var _require = require('backbone');

  var View = _require.View;

  var MetaView = require('plug/views/users/profile/MetaView');
  var Style = require('extplug/util/Style');

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

  ProfileView._style = new Style({
    '#extplug-user-profiles .profile': {
      '.container': {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
      }
    }
  });

  module.exports = ProfileView;
});


define('extplug/user-profiles/HistoryPanelView',['require','exports','module','plug/views/playlists/media/panels/UserHistoryPanelView'],function (require, exports, module) {
  var HistoryPanelView = require('plug/views/playlists/media/panels/UserHistoryPanelView');

  var ProfileHistoryPanelView = HistoryPanelView.extend({
    getSelectedRows: function getSelectedRows() {},
    selectMultipleRows: function selectMultipleRows() {},
    updateSelectedRows: function updateSelectedRows() {},
    toggleRow: function toggleRow() {}
  });

  module.exports = ProfileHistoryPanelView;
});


var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

define('extplug/user-profiles/HistoryView',['require','exports','module','jquery','backbone','plug/models/currentMedia','plug/models/HistoryEntry','plug/models/Room','plug/models/Media','plug/util/util','./HistoryPanelView'],function (require, exports, module) {
  var $ = require('jquery');
  var Backbone = require('backbone');
  var currentMedia = require('plug/models/currentMedia');
  var HistoryEntry = require('plug/models/HistoryEntry');
  var Room = require('plug/models/Room');
  var Media = require('plug/models/Media');
  var util = require('plug/util/util');
  var HistoryPanelView = require('./HistoryPanelView');

  function toInt(el) {
    return parseInt(el.find('span').text().trim(), 10);
  }

  function getHistory(user, cb) {
    if (user.get('slug')) {
      next(user.get('slug'));
    } else if (user.get('level') >= 5) {
      new UserFindAction(user.id).on('success', function (user) {
        if (!user.get('slug')) return;
        next(user.get('slug'));
      });
    }

    function next(slug) {
      $.get('https://plug.dj/@/' + user.get('slug'), parseProfileBody);
    }
    function parseProfileBody(body) {
      // get the actual body, without all the link and script tags
      var bodyStart = body.indexOf('<body>');
      var bodyEnd = body.indexOf('</body>', bodyStart + 1);
      body = body.substring(bodyStart + 6, bodyEnd);
      // prevent the browser from trying to load all the youtube images
      // already
      body = body.replace(/img src=/g, 'img data-src=');
      var history = [];
      $('.row', body).each(function () {
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
            cid: image.match(/\/([a-zA-Z0-9_\-]{11,})\//)[1]
          });
        } else {
          // soundcloud video, we can't really extract the ID properly
          media.set({ format: 2 });
        }
        var he = new HistoryEntry({
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

  var HistoryView = Backbone.View.extend({
    id: 'extplug-user-profiles-history',
    className: 'user-content',
    initialize: function initialize() {
      var _this = this;

      this.history = new Backbone.Collection();
      if (this.model) {
        getHistory(this.model, function (e, history) {
          _this.history.reset(history);
        });
      }
    },
    render: function render() {
      if (this.model.get('level') < 5) {
        this.$el.append('\n          You can only view the history of users above level 5,\n          but ' + this.model.get('username') + ' is only level\n          ' + this.model.get('level') + '.\n        ');
        return this;
      }
      this.list = new HistoryPanelView({ collection: this.history });
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


define('extplug/user-profiles/CommunitiesView',['require','exports','module','jquery','backbone','extplug/util/Style','plug/actions/rooms/ListRoomsAction','plug/views/dashboard/list/CellView','plug/models/Room'],function (require, exports, module) {
  var $ = require('jquery');

  var _require = require('backbone');

  var View = _require.View;

  var Style = require('extplug/util/Style');
  var ListRoomsAction = require('plug/actions/rooms/ListRoomsAction');
  var CommunityView = require('plug/views/dashboard/list/CellView');
  var Room = require('plug/models/Room');

  var CommunitiesView = View.extend({
    className: 'user-content communities',
    render: function render() {
      this.$container = $('<div />').addClass('container');
      this.$rooms = $('<div />').addClass('grid');
      this.$el.append(this.$container);
      this.$container.append(this.$rooms);
      this.$container.jScrollPane();
      this.scrollPane = this.$container.data('jsp');
      this.cells = [];
      this.getCommunities(this.model.get('username'));
      return this;
    },
    getCommunities: function getCommunities(host) {
      var _this = this;

      new ListRoomsAction(host, 0).on('success', function (rooms) {
        _this.setRooms(rooms.filter(function (room) {
          return room.host === host;
        }));
      }).on('error', function (e) {
        throw e;
      });
    },
    onResize: function onResize(size) {},
    setRooms: function setRooms(rooms) {
      var _this2 = this;

      this.cells = rooms.map(function (room) {
        return new CommunityView({ model: new Room(room) });
      });
      this.cells.forEach(function (cell) {
        cell.render();
        _this2.$rooms.append(cell.$el);
      });
      this.scrollPane.reinitialise();
    },
    remove: function remove() {
      this.cells.forEach(function (cell) {
        return cell.destroy();
      });
      this.cells = [];
      this.scrollPane && this.scrollPane.destroy();
      this.scrollPane = null;
      this.$container.remove();
      this.$container = null;
      this._super();
    }
  });

  CommunitiesView._style = new Style({
    '#extplug-user-profiles .communities': {
      '.container': {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
      }
    }
  });

  module.exports = CommunitiesView;
});


define('extplug/user-profiles/UserView',['require','exports','module','extplug/util/Style','plug/views/users/UserView','plug/core/Events','./MenuView','./ProfileView','./HistoryView','./CommunitiesView'],function (require, exports, module) {

  var Style = require('extplug/util/Style');
  var UserView = require('plug/views/users/UserView');
  var Events = require('plug/core/Events');
  var MenuView = require('./MenuView');
  var ProfileView = require('./ProfileView');
  var HistoryView = require('./HistoryView');
  var CommunitiesView = require('./CommunitiesView');

  var UserProfileView = UserView.extend({
    id: 'extplug-user-profiles',

    initialize: function initialize() {
      this.resizeBind = this.onResize.bind(this);
      this.showBind = this.onShow.bind(this);
      this.hideBind = this.onHide.bind(this);
      this.showing = false;
    },

    render: function render() {
      this.$el.empty();
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
      } else if (section === 'community') {
        this.view = new CommunitiesView({ model: this.model });
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

  UserProfileView._style = new Style({
    '#extplug-user-profiles': {
      background: '#111317',
      'z-index': '500',
      '.user-content': {
        position: 'absolute',
        top: '0',
        height: '100%' }
    }
  });

  module.exports = UserProfileView;
});


define('extplug/user-profiles/main',['require','exports','module','jquery','meld','extplug/Module','plug/actions/users/UserFindAction','plug/models/User','plug/views/users/userRolloverView','./UserView'],function (require, exports, module) {

  var $ = require('jquery');
  var meld = require('meld');

  var Module = require('extplug/Module');
  var UserFindAction = require('plug/actions/users/UserFindAction');
  var User = require('plug/models/User');
  var rolloverView = require('plug/views/users/userRolloverView');

  var UserView = require('./UserView');

  module.exports = Module.extend({
    name: 'User Profiles',

    enable: function enable() {
      var _this = this;

      this._super();
      this.linkAdvice = meld.after(rolloverView, 'showSimple', function () {
        var username = $('#user-rollover .username');
        if (rolloverView.user.get('level') >= 5) {
          var usernameText = username.text();
          username.empty().append($('<a />').css({ color: 'white' }).attr('href', 'javascript:void 0;').text(usernameText).on('click', function () {
            _this.showProfile(rolloverView.user.get('id'));
            rolloverView.cleanup();
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
      var _this2 = this;

      new UserFindAction(id).on('success', function (user) {
        if (_this2.userView) {
          _this2.userView.model = new User(user);
          _this2.userView.render();
        } else {
          _this2.userView = new UserView({ model: new User(user) });
          _this2.userView.render();
          _this2.userView.$el.appendTo('body');
        }
        _this2.userView.show('profile');
      });
    }
  });
});
