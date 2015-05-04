define(function (require, exports, module) {
  const $ = require('jquery');
  const Backbone = require('backbone');
  const HistoryPanelView = require('./HistoryPanelView');

  const HistoryView = Backbone.View.extend({
    id: 'extplug-user-profiles-history',
    className: 'user-content',
    render: function () {
      if (this.model.get('level') < 5) {
        this.$el.append(`
          You can only view the history of users above level 5,
          but ${this.model.get('username')} is only level
          ${this.model.get('level')}.
        `);
        return this;
      }
      this.list = new HistoryPanelView({ collection: this.model.get('history') });
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
