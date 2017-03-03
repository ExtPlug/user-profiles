import { Collection } from 'backbone';
import Media from 'plug/models/Media';
import HistoryEntry from 'plug/models/HistoryEntry';
import util from 'plug/util/util';
import request from 'extplug/util/request';

function wrapEntry(entry) {
  util.deserializeHistoryItem(entry);
  entry.media = new Media(entry.media);
  return new HistoryEntry(entry);
}

// gets full user profile info, including slug, blurb and play history
export default function getProfileInfo(user) {
  return Promise.all([
    request.json(`${location.origin}/_/profile/${user.get('id')}`),
    request.json(`${location.origin}/_/users/${user.get('id')}`)
  ]).then((results) => {
    const data = results[0].data[0];

    return user.set({
      ...results[1].data[0],
      blurb: data.user.blurb,
      history: new Collection(data.history.map(wrapEntry)),
    });
  });
}
