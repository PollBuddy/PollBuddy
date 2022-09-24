let list = [];

module.exports = {
  append: function (name, urlSuffix) {
    list.push([name, urlSuffix]);
  },
  getList: function () {
    return list;
  }
};
