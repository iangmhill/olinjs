var home = function(req, res){
  var date = new Date();
  var answer = date.getMonth() === 11 && date.getDate() === 25 ? 'YES' : 'NO';
  res.render("home", {"answer": answer});
};

module.exports.home = home;