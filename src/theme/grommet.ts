import { deepMerge } from 'grommet/utils';

export const palette = {
  NaviViolet900: '#17152E',
  NaviViolet800: '#373551',
  NaviViolet700: '#575371',
  NaviViolet600: '#6A6684',
  NaviViolet500: '#938EAE',
  NaviViolet400: '#B3AED0',
  NaviViolet300: '#D8D2F5',
  NaviViolet200: '#E8E2FD',
  NaviViolet100: '#F2ECFE',
  NaviViolet50: '#FAF4FE',
  DeepViolet900: '#1F1D39',
  DeepViolet800: '#2B2C50',
  DeepViolet700: '#33355C',
  DeepViolet600: '#3B3E67',
  DeepViolet500: '#41456F',
  DeepViolet400: '#5B5E81',
  DeepViolet300: '#767A96',
  DeepViolet200: '#9B9EB4',
  DeepViolet100: '#C1C4D2',
  DeepViolet50: '#E6E8ED',
  White: '#FFFFFF',
  Black: '#0E0C1D',
  Grey: '#999AAA',
  Purple: '#7940c4',
  Blue: '#4852FF',
  Yellow: '#e5e34d',
  Grey100: '#232631',
};

export const grommet = {
  global: {
    focus: {
      border: {
        color: "transparent",
      },
    },
    colors: {},
    palette,
    select: {
      clear: {
        color: "brand",
      },
    },
    font: {
      family: "Rubik",
      size: "14px",
      height: "22px",
      weight: 400
    },
  },
  checkBox: {
    size: '16px',
    color: 'white',
    border: {
      width: '2px',
      color: '#5359C6'
    },
    toggle: {
      color: '#5359C6'
    },
    icon: {
      size: '12px',
      extend: () => `
        background: #5359C6;
      `
    },
    check: {
      radius: '2px',
      thickness: '3px',
      extend: () => `
        border-color: #5359C6;
      `
    },
    hover: {
      border: {
        color: '#5359C6'
      },
    }
  },
  anchor: {
    color: 'text',
    textDecoration: "none",
    hover: {
      textDecoration: "none",
    },
  },
  button: {
    default: {}
  },
  dataTable: {
    border: {
      header: {
        color: 'border'
      }
    },
    body: {
      extend: () => ``
    },
  },
  text: {
    xsmall: {
      size: '10px',
      height: '18px',
    },
    small: {
      size: '12px',
      height: '20px',
    },
    medium: {
      size: '14px',
      height: '22px',
    },
    large: {
      size: '18px',
      height: '24px',
    },
    xlarge: {
      size: '22px',
      height: '28px',
    },
    xxlarge: {
      size: '26px',
      height: '32px',
    },
  }
};

export const darkTheme = deepMerge(grommet, {
  global: {
    colors: {
      background: '#18181A',
      accentWhite: '#E4E4E8',
      accentWhite2: '#B6B7C8',
      textHeader: '#D6D6DC',
      accentLabel: '#C5C6D3',
      inputLabel: '#9D9EAF',
      labelInactive: '#818298',
      text: '#ADAEB8',
      textBlack: palette.Black,
      textSecondary: '#838495',
      textWarning: '#D6B65C',
      textTitle: '#B0B1CF',
      textButtonSecondary: '#989DB3',
      sidePanelBackground: '#232631',
      menuItemBackground: 'rgba(255, 255, 255, 0.07)',
      menuHoverBackground: 'rgba(255, 255, 255, 0.01)',
      menuItemActive: palette.White,
      menuItemInactive: palette.Grey,
      headerBackground: '#191D28',
      footerBackground: '#191D28',
      primaryButtonBackground: '#373E62',
      actionButtonBackground: '#5359C6',
      border: '#2D2E43',
      borderListItem: '#383D57',
      borderSteps: '#3F415A',
      tableRowBorder: '#3D3F5C',
      arrow: '#383D57',
      modalBackground: '#191D28',
      listItemBackground: '#242833',
      badgeBackground: '#26262C',
      rateNegative: '#DD6E6E',
      ratePositive: '#5ABF7D',
      positiveValue: '#70D693',
      positiveValueBackground: '#1C3838',
      negativeValue: '#F06666',
      tooltipBackground: '#232631',
      spinner: palette.Blue,
      errorMessage: '#E76565',
      inputBg: '#19191A',
      inputBgLight: '#2E2E38',
      filterActiveBg: '#25252D',
      optionBg: '#292933',
      widgetBg: '#1E1E20',
      widgetBgDark: '#1B1B1D',
      dividerBg: '#414258',
      activeStatus: '#4852FF',
      golden: '#FFDF00'
    },
  },
  button: {
    extend: (props: any) => {
      const background = props.primary
        ? '#373E62'
        : 'rgba(255, 255, 255, 0.06);'
      const color = props.primary ? '#C6C7EC' : palette.White
      const hoverBackground = props.primary ? '#495383' : 'rgba(255, 255, 255, 0.08)'

      return `
        padding: 8px 16px;
        text-align: center;
        background: ${background};
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        color: ${color};
        user-select: none;
        
        &:hover {
          background: ${hoverBackground};
          color: ${palette.White}
        }
      `
    },
  },
});
