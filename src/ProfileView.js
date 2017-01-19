import $ from 'jquery';
import { View } from 'backbone';
import MetaView from './MetaView';

const ProfileView = View.extend({
  className: 'user-content profile',

  render() {
    this.meta = new MetaView({ model: this.model });
    this.$container = $('<div />').addClass('container');
    this.$container.append(this.meta.$el);
    this.$el.append(this.$container);
    this.meta.render();
    this.$container.jScrollPane();
    this.scrollPane = this.$container.data('jsp');
    return this;
  },

  onResize(e) {},

  remove() {
    this.scrollPane && this.scrollPane.destroy();
    this.meta.destroy();
    this.$container.remove();
    this.scrollPane = null;
    this.meta = null;
    this.$container = null;
    this._super();
  }
});

export default ProfileView;
