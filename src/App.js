// import logo from "ethlogo.png";
import "./App.css";
import Identicon from "react-identicons";

import Button from "react-bootstrap/Button";
import EthWallet from "./components/EthWallet";
import EthExchange from "./components/EthExchange";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import EthTest from "./components/EthTest";
import detectEthereumProvider from "@metamask/detect-provider";
// import SaiToken from "./contracts_abis/SaiToken.json";
import * as Utility from './utilities/utils';


function App() {
  const [currentPage, setCurrentPage] = useState("ethWallet"); //ethExchange || ethWallet
  let [message, setMessage] = useState("Loading...");

  // const [accounts, setAccounts] = useState(undefined);
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [currentNetworkId, setCurrentNetworkId] = useState(undefined);
  const [currentChainId, setCurrentChainId] = useState(undefined);

  // const [balance, setBalance] = useState(undefined);
  // const [transaction, setTransaction] = useState([]);
  let [ethereum, setEthereum] = useState(undefined); //web3provider
  const [web3, setWeb3] = useState(undefined);
  // let ethereum = null;
  const [color, setColor] = useState("#fafafd");
  const [headerClass, setHeaderClass] = useState("moduleSelector");
  const [connected, setConnected] = useState(false);
  let [addressScanUrl, setAddressScanUrl] = useState(undefined);

  function handleAccountsChanged(accounts) {
    console.log("handleAccountsChanged called..", accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
      setCurrentAccount('');
      setMessage(
        "Please connect to Metamask Kovan network and refresh page..."
      );
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
      console.log("Current account has been changed to:--", accounts[0]);
      // Do any other work!
    }
  }

  function handleChainChanged(_chainId) {
    let chainId = parseInt(_chainId);
    console.log("handleChainChanged called...", _chainId, currentChainId);
    window.location.reload();
  }

  const onLoginHandler = () => {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please manually connect this app to MetaMask.");
          setMessage("Please manually connect this app to MetaMask.");
        } else {
          console.error(err);
          setMessage("Erro in login:" + err.message);
        }
      });
  };

  // const startApp = useCallback(async (provider) => {});

  const listenScrollEvent = (e) => {
    // console.log(window.scrollY);
    // if (window.scrollY > 150) {
    //   setHeaderClass("moduleSelector1");
    // } else {
    //   setHeaderClass("moduleSelector");
    // }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    console.log('app.js useeffect called..');
    const init = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        console.log("app.js useeffect init called...");
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
          console.error("Do you have multiple wallets installed?");
          setMessage("Do you have multiple wallets installed?");
        }

        console.log("provider", provider);
        ethereum = provider;
        setEthereum(provider);
        /**********************************************************/
        /* Handle chain (network) and chainChanged (per EIP-1193) */
        /**********************************************************/
        const chainId = parseInt(
          await ethereum.request({ method: "eth_chainId" })
        );
        console.log("chianId:", parseInt(chainId));
        // handleChainChanged(chainId);
        ethereum.on("chainChanged", handleChainChanged);
        if (chainId !== 42 && chainId !== 1337 && chainId !== 3 && chainId !== 4 && chainId !== 97) {
          setMessage("Please connect to Kovan, Ropsten, BSC Testnet or Rinkeby Network...");
          return false;
        }
        console.log('networkid:--------------', ethereum.networkVersion);
        setCurrentNetworkId(ethereum.networkVersion);
        let addScanUrl = await Utility.getAddressScanUrl(ethereum.networkVersion);
        console.log('---------------addScanurl:',addScanUrl);

        setAddressScanUrl(addScanUrl);
        setCurrentChainId(chainId);

        // ethereum.on('chainChanged', (_chainId) => window.location.reload());
        /***********************************************************/
        /* Handle user accounts and accountsChanged (per EIP-1193) */
        /***********************************************************/
         // // Note that this event is emitted on page load.
        // // If the array of accounts is non-empty, you're already
        // // connected.
        ethereum.on("accountsChanged", handleAccountsChanged);

        ethereum
          .request({ method: "eth_accounts" })
          .then(handleAccountsChanged)
          .catch((err) => {
            // Some unexpected error.
            // For backwards compatibility reasons, if no accounts are available,
            // eth_accounts will return an empty array.
            console.error(err);
            setMessage(err);
          });

       
        // ethereum.on("connect", (connectInfo) => {console.log('connected..chainId:', connectInfo);})
        // ethereum.on("disconnect", (error) => {console.log('disconnected...chainId:', error);})
        // const networkId = await provider.request({ method: "net_version" });
        // console.log("networkId:--", networkId);
        // setCurrentNetworkId(networkId);

        let web3 = new Web3(provider);
        // setCurrentNetworkId(await web3.eth.net.getId());
        setWeb3(web3);
        setMessage("");
      } else {
        console.log("***************please install metamask");
        setMessage("Couldn't find ethereum connector. Please install metamask");
      }
    };
    init();
    return () => {
      if (ethereum) {
        console.log("useEffect cleanup");
        ethereum.removeAllListeners();
      }
    };
  }, [currentAccount, currentNetworkId]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="menuItemLogo">
          <img className="rotate" src="ethicon.svg" alt="ethicon" />
        </div>
        <div>Welcome to Sai Marketplace</div>

        <div className="mediumFont">
          {currentAccount ? (
            <div>
              <div >
              <a href={addressScanUrl+currentAccount} target='_blank' className="smallFont red">{Utility.getShortAddress(currentAccount)}</a>
               
                &nbsp;&nbsp;
              </div>
              {/* <div><Identicon string={currentAccount} size='30' count='5' fg='red'/></div> */}
            </div>
          ) : (
            <div className="smallFont">
              <a onClick={onLoginHandler} href="#">
                Login
              </a>
              &nbsp;&nbsp;
            </div>
          )}
        </div>
      </header>

      <div className="app_body">
        <div className={headerClass}>
          <Button
            variant="secondary btn-sm"
            onClick={() => {
              setCurrentPage("ethWallet");
            }}
            active
          >
            Ether Wallet
          </Button>{" "}
          <div className="saiLogoDiv"></div>
          <Button
            variant="secondary btn-sm"
            onClick={() => {
              setCurrentPage("ethExchange");
            }}
            active
          >
            Ether Exchange
          </Button>{" "}
        </div>
        {message ? (
          <div className="moduleContainer">
            <div className="message">
              <h5>{message}</h5>
            </div>
          </div>
        ) : (
          <div className="moduleContainer">
            {currentPage === "ethWallet" ? (
              <EthWallet
                web3={web3}
                currentAccount={currentAccount}
                currentNetworkId={currentNetworkId}
                addressScanUrl={addressScanUrl}
              />
            ) : (
              <EthExchange
                web3={web3}
                currentAccount={currentAccount}
                currentNetworkId={currentNetworkId}
                addressScanUrl={addressScanUrl}
              />
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <span>&#169; Copyright 2021 (Decode Blocks)</span>
        <span>To contact developer email at satyas2099@gmail.com</span>
      </footer>
    </div>
  );
}

export default App;
