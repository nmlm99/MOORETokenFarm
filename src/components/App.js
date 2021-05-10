import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import Navbar from './Navbar'
import Main from './Main';
import './App.css'

import DaiToken from '../abis/DaiToken.json';
import MOOREToken from '../abis/MOOREToken.json';
import TokenFarm from '../abis/TokenFarm.json';

function App() {
  const [account, setAccount] = useState('');
  const [daiToken, setDaiToken] = useState({});
  const [MOOREToken, setMOOREToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState('0');
  const [MOORETokenBalance, setMOORETokenBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-ethereum browser detected. You should consider trying MetaMask!')
    }
 
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const [userAccount] = await web3.eth.getAccounts();
    setAccount(userAccount)

    const networkId = await web3.eth.net.getId();
    
    //Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      setDaiToken(daiToken);
      let daiTokenBalance = await daiToken.methods.balanceOf(userAccount).call()
      setDaiTokenBalance(daiTokenBalance.toString())
    } else {
      window.alert('DaiToken contract not deployed to detected network')
    }
    
    //Load MOOREToken
    const MOORETokenData = MOOREToken.networks[networkId];
    if (MOORETokenData) {
      const MOOREToken = new web3.eth.Contract(MOOREToken.abi, MOORETokenData.address)
      setMOOREToken(MOOREToken);
      let MOORETokenBalance = await MOOREToken.methods.balanceOf(userAccount).call()
      setMOORETokenBalance(MOORETokenBalance.toString())
    } else {
      window.alert('MOOREToken contract not deployed to detected network')
    }
    
    //Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      setTokenFarm(tokenFarm);
      let stakingBalance = await tokenFarm.methods.stakingBalance(userAccount).call()
      setStakingBalance(stakingBalance.toString())
    } else {
      window.alert('TokenFarm contract not deployed to detected network')
    }
    setLoading(false)
  }

  const stakeTokens = (amount) => {
    setLoading(true)
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash) => {
      tokenFarm.methods.stakeTokens(amount).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false)
      })
    })
  }

  const unstakeTokens = () => {
    setLoading(true)
    tokenFarm.methods.unstakeTokens().send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false)
    })
  }

  useEffect(() => {
     loadWeb3();
     loadBlockchainData();
  }, [])

  let content;
  loading ? 
  content = <p id="loader" className="text-center">Loading...</p> : 
  content = <Main 
    daiTokenBalance={daiTokenBalance}
    MOORETokenBalance={MOORETokenBalance}
    stakingBalance={stakingBalance}
    stakeTokens={stakeTokens}
    unstakeTokens={unstakeTokens}
  />

    return (
      <div>
        <Navbar account={account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/baystef"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
}

export default App;
