const generateSlug = (str) => {
  return str
      .toLowerCase()
      .replace(/[^\w\sа-яА-ЯёЁіІїЇєЄҐґ\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
};

module.exports = {
  generateSlug
};
