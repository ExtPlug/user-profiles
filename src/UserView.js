define(function (require, exports, module) {

  const UserView = require('plug/views/users/UserView');
  const Events = require('plug/core/Events');
  const getUserClasses = require('extplug/util/getUserClasses');
  const MenuView = require('./MenuView');
  const ProfileView = require('./ProfileView');
  const HistoryView = require('./HistoryView');
  const $ = require('jquery');

  const UserProfileView = UserView.extend({
    id: 'extplug-user-profiles',

    initialize() {
      this.resizeBind = this.onResize.bind(this);
      this.showBind = this.onShow.bind(this);
      this.hideBind = this.onHide.bind(this);
      this.showing = false;
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
      }
      else if (section === 'played') {
        this.view = new HistoryView({ model: this.model });
      }
      this.$el.append(this.view.$el);
      this.view.render();
    },

    onShow() {
      $('#footer-user').addClass('showing');
      Events.once('hide:user', this.hide, this);
      this._super();
    },
    onHide() {
      $('#footer-user').removeClass('showing');
      this._super();
    }

  });

  module.exports = UserProfileView;

});
