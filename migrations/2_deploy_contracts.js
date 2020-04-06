var Adoption = artifacts.require("Adoption");
var power = artifacts.require("Evidence");

module.exports = function (deployer) {

  deployer.deploy(power);
};