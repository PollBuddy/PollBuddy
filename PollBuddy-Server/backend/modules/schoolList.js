let list = [];

module.exports = {
  append: function(name, url) {
    list.push([name, url]);
  },
  getList: function(){
    return list;
  }
};
