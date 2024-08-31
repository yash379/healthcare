
export const stringToColor = (string: string) => {
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
};
export const stringAvatar = (name: string, size: 'small' | 'medium' = 'medium') => {
  return {
    sx: {
      backgroundColor: stringToColor(name),
      width: size === 'small' ? 24 : undefined,
      height: size === 'small' ? 24 : undefined,
      fontSize: size === 'small' ? 12 : undefined,
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
};