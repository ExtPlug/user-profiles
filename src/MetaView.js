import Base from 'plug/views/users/profile/MetaView';
import Lang from 'lang/Lang';

/**
 * A version of the profile MetaView without Blurb editing.
 */
const MetaView = Base.extend({
  render() {
    this._super();
    // remove blurb edit events again
    this.$('.blurb .box').off();
    return this;
  },

  onChange() {
    // if the blurb is empty, plug.dj defaults to "Click here (...)".
    // we don't really want that because you cannot, in fact, change someone
    // else's blurb.
    const blurb = Lang.userPanel.blurb;
    // so we'll default to the empty string instead!
    Lang.userPanel.blurb = '';
    const res = this._super();
    Lang.userPanel.blurb = blurb;
    return res;
  }
});

export default MetaView;
