import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet';

export const theme = deepMerge(grommet, {
  global: {
    breakpoints: {
      xsmall: {
        value: 375,
      },
      small: {
        value: 568,
      },
      medium: {
        value: 768,
      },
      large: {
        value: 1024,
      },
    },
    colors: {
      red: {
        light: '#c15c5c',
        default: '#ba4949',
        dark: '#a44e4e',
      },
      green: {
        light: '#4c9196',
        default: '#38858a',
        dark: '#417b80',
      },
      blue: {
        light: '#4d7fa2',
        default: '#397097',
        dark: '#426c8a',
      },
      grey: {
        light: '#656874',
        default: '#545764',
        dark: '#565963',
      },
      focus: '#FFF',
      input: '#EFEFEF',
    },
    font: {
      family: 'Karla',
    },
    placeholder: '#808080',
    text: {
      dark: '#333333',
      light: '#E6E6E6',
    },
  },
  checkBox: {
    toggle: {
      background: '#cccccc',
      color: '#FFF',
    },
    color: 'grey',
    border: {
      color: '#FFF',
    },
  },
  card: {
    header: {
      background: '#FFF',
    },
    body: {
      background: '#FFF',
    },
    footer: {
      background: '#EFEFEF',
    },
  },
  rangeInput: {
    thumb: {
      color: '#efefef',
    },
  },
  textInput: {
    extend: {
      backgroundColor: '#EFEFEF',
      border: 'none',
    },
  },
  formField: {
    label: {
      margin: {
        horizontal: 'none',
      },
    },
    border: {
      color: '#FFF',
    },
  },
  button: {
    border: {
      radius: '4px',
    },
    primary: {
      extend: {
        backgroundColor: '#363636',
        border: 'none',
      },
    },
  },
});
