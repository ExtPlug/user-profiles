import UserView from 'plug/views/users/UserView';
import Events from 'plug/core/Events';
import getUserClasses from 'extplug/util/getUserClasses';
import MenuView from './MenuView';
import ProfileView from './ProfileView';
import HistoryView from './HistoryView';
import $ from 'jquery';

const UserProfileView = UserView.extend({
  id: 'extplug-user-profiles',

  initialize({ appView }) {
    this.resizeBind = this.onResize.bind(this);
    this.showBind = this.onShow.bind(this);
    this.hideBind = this.onHide.bind(this);
    this.appView = appView;
  },

  render() {
    this.$el.empty()
      .removeClass()
      .addClass('app-left')
      .addClass(getUserClasses(this.model.get('id')).join(' '));
    this.menu = new MenuView({ model: this.model });
    this.menu.render();
    this.menu.on('change:section', this.change, this);
    this.$el.append(this.menu.$el);
    return this;
  },

  change(section) {
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

  onShow() {
    const userMetaView = this.appView.footer.user;
    if (userMetaView) {
      userMetaView.onShowUser();
    }
    Events.once('hide:user', this.hide, this);
    this._super();
  },

  onHide() {
    const userMetaView = this.appView.footer.user;
    if (userMetaView) {
      userMetaView.onHideUser();
    }
    this._super();
  }
});

export default UserProfileView;
