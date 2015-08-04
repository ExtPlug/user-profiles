define(function (require, exports, module) {

  return  {
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

      '.avatar': {
        'position': 'relative',
        'overflow': 'hidden',
        'width': '100%',
        'height': '250px',
        'background': 'linear-gradient(to bottom, #535d80 0, #32324d 56%, #1a1a1a 73%, #73716d 100%)'
      },
      '.item': {
        'position': 'relative',
        'width': '100%',
        'height': '46px',
        'cursor': 'pointer'
      },
      '.item.selected': {
        'background': '#32234c',
        'cursor': 'default'
      },
      '.item i': {
        'top': '8px',
        'left': '5px'
      },
      '.item .label': {
        'position': 'absolute',
        'top': '12px',
        'left': '40px',
        'font-size': '16px'
      }
    }
  };

});
