import $ from 'jquery';
import Backbone from 'backbone';
import HistoryPanelView from 'plug/views/playlists/media/panels/UserHistoryPanelView';

const HistoryView = Backbone.View.extend({
  id: 'extplug-user-profiles-history',
  className: 'user-content',
  render() {
    this.list = new HistoryPanelView({
      collection: this.model.get('history')
    });
    this.$el.append(this.list.$el);
    this.list.render();
    return this;
  },

  onResize(e) {},

  remove() {
    this.list.destroy();
    this.list = null;
    this._super();
  }
});

export default HistoryView;
