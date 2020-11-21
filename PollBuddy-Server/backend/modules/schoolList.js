let list = [];

module.exports = {
  append: function(item) {
    list.push(item);
  },
  getList: function(){
    return list;
  }
};
