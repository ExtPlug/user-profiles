User Profiles
=============

ExtPlug plugin for accessing user profiles through the standard plug.dj UI. It
allows you to see users's profiles, play histories, and the public rooms they
host.

## Installation

You can install this plugin by going to your ExtPlug settings menu, pressing "Install Plugin",
and entering this Plugin URL:

```
https://extplug.github.io/user-profiles/build/user-profiles.js;extplug/user-profiles/main
```

## Crash Course "User Profile Pages"

**Note: Users below level 5 do not have a profile page. You cannot view profile
pages of users below level 5 using this plugin.**

Clicking a username anywhere results in a popup like this:

![Profile Link](https://i.imgur.com/hryJUyO.png)

Clicking a username in such a popup gets you into the Profile View for that
user with some common information.

[![Profile Meta](https://i.imgur.com/9kPD7BK.png)](https://i.imgur.com/dpv8WVS.png)

You can also check their play history and the public rooms that they host
straight from the standard UI.

[![Profile History](https://i.imgur.com/d0mD3L5.png)](https://i.imgur.com/L0smEmS.png)

## Building

**Note: this section is intended for developers only.**

This plugin uses NPM for dependency management and `gulp` for building.

```
npm install
gulp build
```

The built plugin will be stored at `build/user-profiles.js`.

## License

[MIT](./LICENSE)
