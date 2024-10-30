import {ThemeConfig, theme} from "antd";

export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgContainer: '#19191A',
    colorBorder: 'transparent'
  },
  components: {
    InputNumber: {
      algorithm: false,
      borderRadius: 3,
      addonBg: '#2E2E38',
      colorBgBase: '#26262C',
      colorTextBase: '#ADAEB8',
      controlHeight: 36,
      // handleBg: '#222530',
      colorBorder: '#33344C',
      fontSize: 14,
      activeShadow: 'none'
    },
    Select: {
      colorBorder: '#383D57'
    },
    Input: {
      activeBg: '#19191A',
    },
    Slider: {
      colorPrimaryBorderHover: '#E4E4E8',
      handleActiveColor: '#E4E4E8',
      handleColor: '#E4E4E8',
      handleLineWidth: 2,
      handleLineWidthHover: 2.5,
      colorText: '#ADADB8'
    },
    Checkbox: {
      colorBorder: 'white'
    }
  }
}
