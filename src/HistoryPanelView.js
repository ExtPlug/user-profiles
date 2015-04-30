define(function (require, exports, module) {
  const HistoryPanelView = require('plug/views/playlists/media/panels/UserHistoryPanelView');

  const ProfileHistoryPanelView = HistoryPanelView.extend({
    getSelectedRows() {},
    selectMultipleRows() {},
    updateSelectedRows() {},
    toggleRow() {}
  });

  module.exports = ProfileHistoryPanelView;

});
