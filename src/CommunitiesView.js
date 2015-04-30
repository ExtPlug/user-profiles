define(function (require, exports, module) {
  const $ = require('jquery');
  const { View } = require('backbone');
  const Style = require('extplug/util/Style');
  const ListRoomsAction = require('plug/actions/rooms/ListRoomsAction');
  const CommunityView = require('plug/views/dashboard/list/CellView');
  const Room = require('plug/models/Room');

  const CommunitiesView = View.extend({
    className: 'user-content communities',
    render() {
      this.$container = $('<div />').addClass('container');
      this.$rooms = $('<div />').addClass('grid');
      this.$el.append(this.$container);
      this.$container.append(this.$rooms);
      this.$container.jScrollPane();
      this.scrollPane = this.$container.data('jsp');
      this.cells = [];
      this.getCommunities(this.model.get('username'));
      return this;
    },
    getCommunities(host) {
      new ListRoomsAction(host, 0)
        .on('success', rooms => {
          this.setRooms(rooms.filter(room => room.host === host));
        })
        .on('error', e => { throw e });
    },
    onResize(size) {
    },
    setRooms(rooms) {
      this.cells = rooms.map(room => {
        return new CommunityView({ model: new Room(room) });
      });
      this.cells.forEach(cell => {
        cell.render();
        this.$rooms.append(cell.$el);
      });
      this.scrollPane.reinitialise();
    },
    remove() {
      this.cells.forEach(cell => cell.destroy());
      this.cells = [];
      this.scrollPane && this.scrollPane.destroy();
      this.scrollPane = null;
      this.$container.remove();
      this.$container = null;
      this._super();
    }
  });

  CommunitiesView._style = new Style({
    '#extplug-user-profiles .communities': {
      '.container': {
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%'
      }
    }
  });

  module.exports = CommunitiesView;

});