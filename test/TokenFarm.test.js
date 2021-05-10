const TokenFarm = artifacts.require('TokenFarm');
const DaiToken = artifacts.require('DaiToken');
const MOOREToken = artifacts.require('MOOREToken');

require('chai').use(require('chai-as-promised')).should()

const tokens = (n) => web3.utils.toWei(n, 'ether');

// const [owner, investor] = accounts
contract('TokenFarm', ([owner, investor]) => {

  let daiToken,MOORETokenn, tokenFarm;

  before(async () => {
     daiToken = await DaiToken.new()
     MOOREToken = await MooreToken.new()
     tokenFarm = await TokenFarm.new(MOOREToken.address, daiToken.address)
     // Transfer all Dapp tokens to token farm
     await MOOREToken.transfer(tokenFarm.address, tokens('1000000'))

     // Transfer 100 mDai tokens to investor
     await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      let name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('MOORE Token deployment', async () => {
    it('has a name', async () => {
      let name = await MOOREToken.name()
      assert.equal(name, 'MOORE Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      let name = await tokenFarm.name()
      assert.equal(name, 'Moore Token Farm')
    })

    it('has tokens', async () => {
      let balance = await MOOREToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming Tokens', async () => {
    it('rewards investors for staking mDai tokens', async () => {
      let result;
      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet balance correct before staking')
   
      // Stake Mock DAI Tokens
      await daiToken.approve(TokenFarm.address, tokens('100'), { from: investor }) 
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')
     
      result = await daiToken.balanceOf(TokenFarm.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm balance correct after staking')

      result = await TokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'true', 'Investor statking status correct after staking')
   
      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })

      // Check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Dapp Token wallet balance correct after issuance')

      // Ensure only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor })

      // Check result after Unstaking tokens
      result =  await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), "investor Mock DAI wallet balance correct after unstaking")
      
      result =  await daiToken.balanceOf(TokenFarm.address)
      assert.equal(result.toString(), tokens('0'), "TOken Farm Mock DAI balance correct after unstaking")
   
      result = await TokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), "investor staking balance correct after unstaking")
     
      result = await TokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'false', "investor staking staus correct after unstaking")
    })

  })
})