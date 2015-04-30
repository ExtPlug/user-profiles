define(function (require, exports, module) {

  const Style = require('extplug/util/Style');
  const UserView = require('plug/views/users/UserView');
  const Events = require('plug/core/Events');
  const MenuView = require('./MenuView');
  const ProfileView = require('./ProfileView');
  const HistoryView = require('./HistoryView');
  const CommunitiesView = require('./CommunitiesView');

  const UserProfileView = UserView.extend({
    id: 'extplug-user-profiles',

    initialize() {
      this.resizeBind = this.onResize.bind(this);
      this.showBind = this.onShow.bind(this);
      this.hideBind = this.onHide.bind(this);
      this.showing = false;
    },

    render() {
      this.$el.empty();
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
      else if (section === 'community') {
        this.view = new CommunitiesView({ model: this.model });
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

  UserProfileView._style = new Style({
    '#extplug-user-profiles': {
      'background': '#111317',
      'z-index': '500',
      '.user-content': {
        'position': 'absolute',
        'top': '0',
        'height': '100%',
      }
    }
  });

  module.exports = UserProfileView;

});
