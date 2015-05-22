define(function (require, exports, module) {

  // copy some CSS styles from an element.
  // used for some of the menu styling, because it's quite complex and
  // only uses the #user-menu ID ):
  function copyStyles(el, props) {
    let style = window.getComputedStyle($(el)[0]);
    return props.reduce((obj, prop) => {
      obj[prop] = style.getPropertyValue(prop);
      return obj;
    }, {});
  }

  return function () {
    return {
      '#extplug-user-profiles': {
        'background': '#111317',
        'z-index': '500',
        '.user-content': {
          'position': 'absolute',
          'top': '0',
          'height': '100%',
        },

        '.profile': {
          '.container': {
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',

            // hide Points and Subscribe buttons, since
            // they always show the current user's data
            '.meta .points': { 'display': 'none' }
          }
        },

        '.communities': {
          '.container': {
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%'
          }
        }
      },

      '#extplug-user-profiles-menu': {
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'max-width': '220px',
        'width': '22%',
        'height': '100%',
        'background': '#1c1f25',

        '.avatar': copyStyles('#user-menu .avatar', [
          'position', 'overflow', 'width', 'height', 'background'
        ]),
        '.item': copyStyles('#user-menu .item:not(.selected)', [
          'position', 'width', 'height', 'cursor'
        ]),
        '.item.selected': {
          'background': '#32234c',
          'cursor': 'default'
        },
        '.item i': copyStyles('#user-menu .item i', [ 'top', 'left' ]),
        '.item .label': copyStyles('#user-menu .item .label', [
          'position', 'top', 'left', 'font-size'
        ])
      }
    }
  };

});
