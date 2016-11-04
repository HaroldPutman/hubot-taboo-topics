require("babel-register");
console.log("yes"); 
var mainJs = require("./src/main");
console.log(mainJs);
module.exports = mainJs;
