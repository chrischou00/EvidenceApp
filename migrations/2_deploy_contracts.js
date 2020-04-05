var Adoption = artifacts.require("Adoption");
var power = artifacts.require("Cert");

module.exports = function (deployer) {

  deployer.deploy(power);
};