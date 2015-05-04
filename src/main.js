define(function (require, exports, module) {

  const $ = require('jquery');
  const meld = require('meld');

  const Plugin = require('extplug/Plugin');
  const UserFindAction = require('plug/actions/users/UserFindAction');
  const User = require('plug/models/User');
  const rolloverView = require('plug/views/users/userRolloverView');

  const UserView = require('./UserView');

  module.exports = Plugin.extend({
    name: 'User Profiles',

    enable() {
      this._super();
      this.linkAdvice = meld.after(rolloverView, 'showSimple', () => {
        let username = $('#user-rollover .username');
        if (rolloverView.user.get('level') >= 5) {
          let usernameText = username.text()
          username.empty().append(
            $('<a />')
              .css({ color: 'white' })
              .attr('href', 'javascript:void 0;')
              .text(usernameText)
              .on('click', () => {
                this.showProfile(rolloverView.user.get('id'));
                rolloverView.cleanup();
              })
          );
        }
      });
    },

    disable() {
      this.linkAdvice.remove();
      if (this.userView) {
        this.userView.destroy();
      }
      this.userView = null;
      this._super();
    },

    showProfile(id) {
      new UserFindAction(id)
        .on('success', user => {
          if (this.userView) {
            this.userView.model = new User(user);
            this.userView.render();
          }
          else {
            this.userView = new UserView({ model: new User(user) });
            this.userView.render();
            this.userView.$el.appendTo('body');
          }
          this.userView.show('profile');
        })
    }
  });

});