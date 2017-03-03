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
  return request.json(`${location.origin}/_/profile/${user.get('id')}`).then((body) => {
    const data = body.data[0];

    return user.set({
      blurb: data.user.blurb,
      history: new Collection(data.history.map(wrapEntry)),
    });
  });
}
