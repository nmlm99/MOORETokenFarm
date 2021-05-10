const TokenFarm = artifacts.require('TokenFarm');
const DaiToken = artifacts.require('DaiToken');
const Token = artifacts.require('Token');

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock Dai
await deployer.deploy(DaiToken)
const daiToken = await DaiToken.deployed()

// Deploy MOORE
await deployer.deploy(MooreToken)
const MooreToken = await MooreToken.deployed()

// Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address) 
  const tokenFarm = await TokenFarm.deployed();

  // Transfer  tokens to Tokenfarm 
  await MooreToken.transfer(tokenFarm.address, '100000')

  // Transfer 100 mDai tokens to an investor
  await daiToken.transfer(accounts[1], '100')
};
