define(function (require, exports, module) {
  const $ = require('jquery');
  const _ = require('underscore');
  const Events = require('plug/core/Events');
  const AlertEvent = require('plug/events/AlertEvent');
//  var currentUser = require('f3ecc/d813f/a062a');
//  var BefriendAction = require('f3ecc/a67a5/c3ae3/e62c4');
//  var UnfriendAction = require('f3ecc/a67a5/c3ae3/ab103');
  const AvatarManifest = require('plug/util/AvatarManifest');
  const Lang = require('lang/Lang');
  const UserMenuView = require('plug/views/users/menu/UserMenuView');
  const Style = require('extplug/util/Style');
  var ProfileMenuView = UserMenuView.extend({
    id: 'extplug-user-profiles-menu',
    initialize() {
      this._super();
      this.onPress = this.onPress.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onAvatarChange = this.onAvatarChange.bind(this);
    },
    render() {
      this.$el.html(`
        <div class="avatar"></div>
        <div class="item profile" data-value="profile">
          <i class="icon icon-user-grey"></i>
          <span class="label">${Lang.userFriends.profile}</span>
        </div>
        <div class="item played" data-value="played">
          <i class="icon icon-history-grey"></i>
          <span class="label">${Lang.userMenu.played}</span>
        </div>
        <div class="item community" data-value="community">
          <i class="icon icon-community-grey"></i>
          <span class="label">${Lang.appMenu.communities}</span>
        </div>
      `);
      this.$avatar = this.$('.avatar')
        .on('mousedown', this.onPress);
      this.$('.item').on('click', this.onClick);
      this.onAvatarChange();
      return this;
    },
    onAvatarChange() {
      this.$avatar.empty();
      this.$img.attr('src', AvatarManifest.getAvatarUrl(this.model.get('avatarID'), 'b'));
      this.$avatar.append(this.$img);
      this.aviW = 220;
      this.aviO = 0;
      this.model.get('avatarID').indexOf('dragon') > -1 && (this.aviO = -8, this.aviW = 440);
    }
  });

  function copyStyles(el, props) {
    let style = window.getComputedStyle($(el)[0]);
    return props.reduce((obj, prop) => {
      obj[prop] = style.getPropertyValue(prop);
      return obj;
    }, {});
  }

  ProfileMenuView._style = new Style({
    '#extplug-user-profiles-menu': {
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'max-width': '220px',
      'width': '22%',
      'height': '100%',
      'background': '#1c1f25',

      '.avatar': copyStyles('#user-menu .avatar', [
        'position', 'overflow', 'width', 'height', 'background'
      ]),
      '.item': copyStyles('#user-menu .item:not(.selected)', [
        'position', 'width', 'height', 'cursor'
      ]),
      '.item.selected': {
        'background': '#32234c',
        'cursor': 'default'
      },
      '.item i': copyStyles('#user-menu .item i', [ 'top', 'left' ]),
      '.item .label': copyStyles('#user-menu .item .label', [
        'position', 'top', 'left', 'font-size'
      ])
    }
  });

  return ProfileMenuView;

});