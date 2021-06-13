// import logo from "ethlogo.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import EthWallet from "./components/EthWallet";
import EthExchange from "./components/EthExchange";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import EthTest from "./components/EthTest";
import detectEthereumProvider from "@metamask/detect-provider";
// import SaiToken from "./contracts_abis/SaiToken.json";

function App() {
  const [currentPage, setCurrentPage] = useState("ethWallet"); //ethExchange || ethWallet
  let [message, setMessage] = useState("Loading...");

  // const [accounts, setAccounts] = useState(undefined);
  const [currentAccount, setCurrentAccount] = useState("0x0");
  const [currentNetworkId, setCurrentNetworkId] = useState(undefined);
  const [currentChainId, setCurrentChainId] = useState(undefined);

  // const [balance, setBalance] = useState(undefined);
  // const [transaction, setTransaction] = useState([]);
  // const [provider, setProvider] = useState(undefined); //web3provider
  const [web3, setWeb3] = useState(undefined);
  let ethereum = null;
  const [color, setColor] = useState("#fafafd");
  const [headerClass, setHeaderClass] = useState("moduleSelector");

  function handleAccountsChanged(accounts) {
    console.log("handleAccountsChanged called..", accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
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
    const init = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
          console.error("Do you have multiple wallets installed?");
          setMessage("Do you have multiple wallets installed?");
        } 

        console.log("provider", provider);
        ethereum = provider;
        /**********************************************************/
        /* Handle chain (network) and chainChanged (per EIP-1193) */
        /**********************************************************/
        const chainId = parseInt(await ethereum.request({ method: "eth_chainId" }));
        console.log('chianId:', parseInt(chainId));
        // handleChainChanged(chainId);
        ethereum.on("chainChanged", handleChainChanged);
        if (chainId !== 42 && chainId !==1337) {
          setMessage("Please connect to Kovan Network...");
          return false;
        }
        setCurrentNetworkId(chainId);
        setCurrentChainId(chainId);
        
        // ethereum.on('chainChanged', (_chainId) => window.location.reload());
        /***********************************************************/
        /* Handle user accounts and accountsChanged (per EIP-1193) */
        /***********************************************************/
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

        // // Note that this event is emitted on page load.
        // // If the array of accounts is non-empty, you're already
        // // connected.
        ethereum.on("accountsChanged", handleAccountsChanged);

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
      console.log("useEffect cleanup");
      ethereum.removeAllListeners();
    };
  }, [currentAccount, currentNetworkId]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="menuItemLogo">
          <img className="rotate" src="ethicon.svg" alt="ethicon" />
        </div>
        <div>Welcome to Sai Marketplace</div>
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
              />
            ) : (
              <EthExchange 
                web3={web3}
                currentAccount={currentAccount}
                currentNetworkId={currentNetworkId}
              />
            )}
          </div>
        )}
      </div>

      <footer className="footer">
      &#169; copyright 2021 (CodeBlocks) - to contact developer email at satyas2099@gmail.com
      </footer>
    </div>
  );
}

export default App;
