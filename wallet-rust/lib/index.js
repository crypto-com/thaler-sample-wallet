const addon = require("../native/index.node");
console.log("initialize");
console.log(addon.runProgram());
module.exports = addon;
