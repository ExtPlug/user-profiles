define(function (require, exports, module) {
  const $ = require('jquery');

  const ListRoomsAction = require('plug/actions/rooms/ListRoomsAction');
  // used for drawing rooms
  const Base = require('plug/views/users/communities/CommunitiesView');
  const CommunityGridView = require('plug/views/users/communities/CommunityGridView');
  const Room = require('plug/models/Room');
  const { getSize } = require('plug/util/window');
  const SpinnerView = require('plug/views/spinner/SpinnerView');
  // used for the Create Room link
  const Events = require('plug/core/Events');
  const ShowDialogEvent = require('plug/events/ShowDialogEvent');
  const RoomCreateDialog = require('plug/views/dialogs/RoomCreateDialog');

  const CommunitiesView = Base.extend({
    id: null,
    className: 'user-content communities',
    render() {
      this.$top = $('<div />').addClass('top');
      this.$message = $('<div />').addClass('message');
      this.$box = $('<div />').addClass('box');
      this.$el
        .empty()
        .append(this.$top.append(this.$message))
        .append(this.$box);

      this.grid = new CommunityGridView();
      this.$box.append(this.grid.$el);

      this.$box.jScrollPane();
      this.scrollPane = this.$box.data('jsp');

      this.showSpinner();

      this.getCommunities(this.model.get('username'));
      this.allowResize = true;
      return this;
    },

    getCommunities(host) {
      new ListRoomsAction(host, 0)
        .on('success', rooms => {
          this.setRooms(rooms.filter(room => room.host === host));
        })
        .on('error', e => { throw e });
    },

    setRooms(rooms) {
      if (!this.$el) return;
      this.hideSpinner();

      if (rooms.length === 0) {
        this.grid.clear();
        this.$message.text('This user has not created any communities.')
      }
      else {
        this.$message
          .text(`These are ${this.model.get('username')}'s communities. `)
          .append(
            'Click ',
            $('<a />').attr('href', '#').text('here').on('click', () => {
              Events.dispatch(new ShowDialogEvent(
                ShowDialogEvent.SHOW,
                new RoomCreateDialog()
              ));
            }),
            ' to make your own!'
          );
        rooms.map(room => this.grid.draw(new Room(room)));
      }
      this.grid.onUpdate();
      _.defer(() => this.onResize(getSize()));
    },

    showSpinner() {
      this.hideSpinner();
      this._spinner = new SpinnerView({ size: SpinnerView.LARGE });
      this.scrollPane.getContentPane().append(this._spinner.$el);
      this._spinner.render();
    },
    hideSpinner() {
      if (this._spinner) {
        this._spinner.destroy();
        this._spinner = null;
      }
    }
  });

  module.exports = CommunitiesView;

});