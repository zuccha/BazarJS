const makeScrollbarStyle = (color: string) => ({
  'border-right': `8px solid ${color}`,
});

const styles = {
  global: {
    '::-webkit-scrollbar': { width: '14px' },
    '::-webkit-scrollbar-track': makeScrollbarStyle('#E5E5E5'),
    '::-webkit-scrollbar-thumb': makeScrollbarStyle('#AAAAAA'),
    '::-webkit-scrollbar-thumb:hover': makeScrollbarStyle('#888888'),
  },
};

export default styles;
