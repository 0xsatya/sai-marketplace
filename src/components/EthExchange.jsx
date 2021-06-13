import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import { Card, FormControl, InputGroup } from "react-bootstrap";
import EthSwap from "../contracts_abis/EthSwap.json";
import SaiToken from "../contracts_abis/SaiToken.json";

function EthExchange({ web3, currentAccount, currentNetworkId }) {
  const [currentModule, setCurrentModule] = useState("Buy"); //Buy or Sell
  let [inputValue, setInputValue] = useState("");
  let [outputValue, setOutputValue] = useState("");
  let [saiBal, setSaiBal] = useState("00");
  let [ethBal, setEthBal] = useState("00");
  let [message, setMessage] = useState("");
  const [ethSwap, setEthSwap] = useState(undefined);
  const [saiToken, setSaiToken] = useState(undefined);
  const buy = "Buy";
  const sell = "Sell";

  let saiInput = (
    <div className="input-group-append">
      <span className="input-group-text" id="basic-addon2">
        <div
          className="saiLogoSmallDiv"
          style={{ backgroundImage: 'url("sailogo.png")' }}
        ></div>
        SAI
      </span>
    </div>
  );

  let ethInput = (
    <div className="input-group-append">
      <span className="input-group-text" id="basic-addon2">
        <div
          className="saiLogoSmallDiv"
          style={{ backgroundImage: 'url("ethericon.png")' }}
        ></div>
        ETH
      </span>
    </div>
  );
  function tokens(n) {
    return web3.utils.toWei(n, "ether");
  }

  const inputChangedHandler = (e) => {
    let input = Number(e.target.value);
    setInputValue(e.target.value);
    let output = currentModule === buy ? input * 100 : input / 100;
    setOutputValue(output);
    console.log("inputchanged handler", input, output);
  };

  const swapTokensHandler = async () => {
    if(inputValue.trim() === ''){
      inputValue = '1';
    }
    // inputValue = "1";
    // let inputValue1 = '100';
    console.log(currentModule, ethSwap, saiToken);
    if (currentModule === buy) {
      ethSwap.methods
        .buyTokens()
        .send({
          from: currentAccount,
          value: web3.utils.toWei(inputValue, "ether"),
        })
        .on('receipt', (receipt) => {
          console.log(receipt);
          setSaiBal("");
        }).on('error', (error) => {
          console.log('Error in sellToken:', error);
          setMessage(error.message);
      });
      
    } else if (currentModule === sell) {
      let allowance = await saiToken.methods.allowance(currentAccount, ethSwap.options.address).call({from: currentAccount});
      console.log('allowance:', web3.utils.fromWei(allowance));
      setMessage('Allowance: '+ web3.utils.fromWei(allowance)+' SAI');
      if(allowance < inputValue){
        await saiToken.methods.approve(ethSwap.options.address, tokens(String(inputValue*5))).send({from: currentAccount});
      }
      
      ethSwap.methods.sellTokens(tokens(inputValue)).send({
        from: currentAccount,
      })
      .then((receipt) => {
        console.log('sell Token receipt:', receipt);
        setSaiBal("");
      }).catch( error => {
          console.log('Error in sellToken:', error.message);
          setMessage(error.message);
      });
    }
  };

  useEffect(() => {
    setInputValue("");
    setOutputValue("");

    const init = async () => {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      if (currentAccount === "0x0") {
        currentAccount = accounts[0];
      }

      if (currentAccount !== "0x0") {
        console.log("EthExchange initiazed....");
        let netId = await web3.eth.net.getId();
        var ethSwap = new web3.eth.Contract(
          EthSwap.abi,
          EthSwap.networks[netId].address
        );
        console.log(currentAccount, currentNetworkId, netId);
        setEthSwap(ethSwap);

        console.log("ethSwap aDdress:", ethSwap.options.address);
        let ethBalance = web3.utils.fromWei(
          await web3.eth.getBalance(currentAccount)
        );
        console.log("ethBalance:", ethBalance);
        setEthBal(ethBalance);

        var saiToken = new web3.eth.Contract(
          SaiToken.abi,
          SaiToken.networks[netId].address
        );
        setSaiToken(saiToken);
        let saiBalance = await saiToken.methods
          .balanceOf(currentAccount)
          .call();
        console.log("saiBalance:", web3.utils.fromWei(saiBalance));
        setSaiBal(web3.utils.fromWei(saiBalance));
      }
    };
    init();

    return () => {
      //  cleanup
    };
  }, [currentModule, saiBal, ethBal, currentAccount]);

  return (
    <div className="moduleCard">
      <div className="moduleCardHeading">
        <h5>My SAI Exchange</h5>
      </div>
      <div className="moduleCardData">
        <div className="childJustifyBetweeninRow">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              //buy token
              setCurrentModule("Buy");
            }}
          >
            Buy
          </button>
          {/* <span>{"<"}{">"}</span> */}
          <div className="swapSelector">
            {"<"} ETH-SAI {">"}
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setCurrentModule("Sell");
            }}
          >
            {" "}
            Sell
          </button>
        </div>
        <div className="card">
          <div className="card-header text-center">
            <h6> {currentModule} Sai Token</h6>
          </div>
          <div className="card-body">
            <div>
              <div className="childJustifyBetweeninRow">
                <h6>Input</h6>{" "}
                <span>
                  Balance:{" "}
                  <span className="red">
                    {currentModule === "Buy" ? ethBal : saiBal}
                  </span>
                </span>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="input (default 1)"
                  value={inputValue}
                  onChange={inputChangedHandler}
                />
                {currentModule === "Buy" ? ethInput : saiInput}
              </div>
            </div>
            <p></p>
            <div>
              <div className="childJustifyBetweeninRow">
                <h6>Output</h6>{" "}
                <span>
                  Balance:{" "}
                  <span className="red">
                    {currentModule === "Buy" ? saiBal : ethBal}
                  </span>
                </span>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="output"
                  value={outputValue}
                  disabled
                />
                {currentModule === "Buy" ? saiInput : ethInput}
              </div>
            </div>
            <div className="childJustifyBetweeninRow smallFont">
              <span className="card-title">Exchange Rate</span>{" "}
              <span className="card-title">1ETH = 100SAI</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: "100%" }}
              onClick={swapTokensHandler}
            >
              SWAP
            </button>
            <div className="message smallFont red text-center"> {message} </div>
          </div>

          <p className="card-text smallFont red text-center">
            Caution: Don't use the app in ethereum mainnet else you may loose
            money.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EthExchange;
