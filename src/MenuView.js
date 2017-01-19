import $ from 'jquery';
import _ from 'underscore';
import Events from 'plug/core/Events';
import AlertEvent from 'plug/events/AlertEvent';
import AvatarManifest from 'plug/util/AvatarManifest';
import Lang from 'lang/Lang';
import UserMenuView from 'plug/views/users/menu/UserMenuView';
import Style from 'extplug/util/Style';

const ProfileMenuView = UserMenuView.extend({
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

export default ProfileMenuView;
