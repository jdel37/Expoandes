import lightColors from './lightColors';
import darkColors from './darkColors';

const themes = {
  light: lightColors,
  dark: darkColors,
};

export const getTheme = (theme) => themes[theme] || themes.light;

export default lightColors;