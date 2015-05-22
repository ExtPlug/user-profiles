define(function (require, exports, module) {
  const $ = require('jquery');
  const { View } = require('backbone');
  const MetaView = require('plug/views/users/profile/MetaView');

  const ProfileView = View.extend({
    className: 'user-content profile',
    render: function () {
      this.meta = new MetaView({ model: this.model });
      this.$container = $('<div />').addClass('container');
      this.$container.append(this.meta.$el);
      this.$el.append(this.$container);
      this.meta.render();
      this.$container.jScrollPane();
      this.scrollPane = this.$container.data('jsp');
      return this;
    },
    onResize: function (e) {
    },
    remove: function () {
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