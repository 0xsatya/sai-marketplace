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
  const [currentPage, setCurrentPage] = useState("ethWallet");
  let [message, setMessage] = useState(undefined);

  // const [accounts, setAccounts] = useState(undefined);
  const [currentAccount, setCurrentAccount] = useState('0x0');
  const [currentNetworkId, setCurrentNetworkId] = useState(undefined);
  const [currentChainId, setCurrentChainId] = useState(undefined);

  // const [balance, setBalance] = useState(undefined);
  // const [transaction, setTransaction] = useState([]);
  // const [provider, setProvider] = useState(undefined); //web3provider
  const [web3, setWeb3] = useState(undefined);
  let ethereum = null;
  const [color, setColor] = useState('#fafafd');
  const [headerClass, setHeaderClass] = useState('moduleSelector')

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
      console.log("handleAccountsChanged:--", accounts);
      // Do any other work!
    }
  }

  function handleChainChanged(_chainId) {
    let chainId = parseInt(_chainId);
    if (chainId !== currentChainId) {
      console.log("handleChainChanged:", chainId);
      setCurrentChainId(chainId);
    }
    // We recommend reloading the page, unless you must do otherwise
    // window.location.reload();
  }

  const startApp = useCallback(async (provider) => {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    } else ethereum = window.ethereum;

    console.log("provider", provider);
    // Access the decentralized web!

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    const chainId = await ethereum.request({ method: "eth_chainId" });
    handleChainChanged(chainId);
    ethereum.on("chainChanged", handleChainChanged);

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
      });

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on("accountsChanged", handleAccountsChanged);
  });

  const listenScrollEvent = e => {
    if (window.scrollY > 180) {
      setHeaderClass('moduleSelector1');
    } else {
      setHeaderClass('moduleSelector');
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)
    const init = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        startApp(provider);

        const networkId = await provider.request({ method: "net_version" });
        console.log("networkId:--", networkId);
        setCurrentNetworkId(networkId);

        let web3 = new Web3(provider);
        setWeb3(web3);
      } else {
        console.log("***************please install metamask");
      }
    };
    init();
    return () => {
      console.log("useEffect cleanup");
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
      {message ? (
        <div className="app_body">
          <div>
            <h3>{message}</h3>
          </div>
        </div>
      ) : (
        <div className="app_body">
          <div className={headerClass} >
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentPage("ethWallet");
              }}
              active
            >
              Ether Wallet
            </Button>{" "}
            <div className='saiLogoDiv' >
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentPage("ethExchange");
              }}
              active
            >
              Ether Exchange
            </Button>{" "}
          </div>

          <div className="moduleContainer">
            {currentPage === "ethWallet" ? (
              <EthWallet
                web3={web3}
                currentAccount={currentAccount}
                currentNetworkId={currentNetworkId}
              />
            ) : (
              <EthExchange />
            )}
          </div>
        </div>
      )}
      <footer className="footer">
        @ copyright - to contact developer email at satyas2099@gmail.com
      </footer>
    </div>
  );
}

export default App;
