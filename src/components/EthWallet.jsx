import React, { useEffect, useState } from "react";
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import SaiToken from "../contracts_abis/SaiToken.json";
import Identicon from 'react-identicons';

function EthWallet({ web3, currentNetworkId, currentAccount }) {
  let [balance, setBalance] = useState("0000");
  // const [accountAdd, setAccountAdd] = useState("0x00");
  const [provider, setProvider] = useState(undefined);
  let [transferAmount, setTransferAmount] = useState("0");
  let [recipient, setRecipient] = useState("0x0");
  let [transactions, setTransactions] = useState([]);
  const [saiToken, setSaiToken] = useState(undefined);
const [ethBalance, setEthBalance] = useState('0');
  let saiTokenAddress = "";
  // let saiToken = null;

  const TransferFundHandler = (e) => {
    let amount = web3.utils.toWei(transferAmount, "Ether");
    console.log(recipient, amount);
    console.log(saiToken, saiTokenAddress);
    if (!web3.utils.isAddress(recipient)) {
      console.log("not a correct address..");
      alert("Please enter proper recipient address");
      return false;
    }
    saiToken.methods
      .transfer(recipient, amount)
      .send({ from: currentAccount })
      .on("receipt", function (e) {
        console.log("TransferFundReceipt:", e);
        setBalance(0);
      });
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (
          web3 !== undefined &&
          currentAccount !== undefined &&
          currentNetworkId !== undefined
          // web3 !== undefined &&
          // currentNetworkId !== undefined &&
          // currentAccount !== "0x0"
        ) {
          console.log("inside useeffect EthWallet...");
          console.log(web3, currentNetworkId);
          console.log("accountAddress:", currentAccount);
          // console.log("web3:", web3);
          // console.log("web3Provider:", web3.givenProvider);
          // console.log("web3 accounts:", await web3.eth.getAccounts());
          setProvider(web3.givenProvider);
          // console.log("currentNetworkId:", currentNetworkId);
          let netId = await web3.eth.net.getId();
          saiTokenAddress = SaiToken.networks[netId].address;
          let saiTokenMock = new web3.eth.Contract(
            SaiToken.abi,
            saiTokenAddress
          );
          setSaiToken(saiTokenMock);
          // saiToken = saiTokenMock;

          console.log("setSaiTokenMock:", saiTokenMock);
          const bal = await saiTokenMock.methods
            .balanceOf(currentAccount)
            .call();
          console.log("balance:", bal, typeof bal);
          setBalance(web3.utils.fromWei(bal, "Ether"));
          let ethBalance = web3.utils.fromWei(
            await web3.eth.getBalance(currentAccount)
          );
          setEthBalance(ethBalance);

          saiTokenMock
            .getPastEvents(
              "Transfer",
              {
                fromBlock: 0,
                toBlock: "latest",
              },
              function (error, events) {}
            )
            .then(function (events) {
              console.log("Transactions", events); // same results as the optional callback above
              setTransactions(events);
            });

          // console.log(transactions);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };
    init();

    return () => {
      // console.log("EthWallet useeffect cleanup");
    };
  }, [currentNetworkId, currentAccount, balance]);

  return (
    <div className="moduleCard">
      <div className="moduleCardHeading">
        <h5>My Wallet</h5>
      </div>
      <div className="moduleCardData">
        <Card className="text-center" border="info">
          <Card.Header>
            <h5>SAI TOKEN</h5>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>SAI Token </Card.Title> */}
            <Card.Subtitle className="mb-2 text-muted">
              Balance : <span className='red'>{balance} SAI</span> <span className='red'>( {ethBalance} ETH)</span>
            </Card.Subtitle>
            <Card.Subtitle>Account</Card.Subtitle>
            { currentAccount? 
              <Card.Text>
              {/* <img className="ml-2"
              width='30' height='30' 
              src={`data:image/png;base64, ${new Identicon(currentAccount, 30).toString()}`}
              alt='identicon'
              /> */}
              <Identicon string={currentAccount} size='50' count='5'/>
            </Card.Text>
            :
            ''}
            <Card.Link href="#">{currentAccount}</Card.Link>
            <Card.Text></Card.Text>
          </Card.Body>
        </Card>
        <Card className="text-center" border="info">
          <Card.Header>
            <h5>Transfer SAI Tokens</h5>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>Transfer Funds</Card.Title> */}

            <InputGroup className="mb-3" size="sm">
              <FormControl
                placeholder="Recipient's Address"
                aria-label="Recipient's address"
                aria-describedby="basic-addon2"
                onChange={(e) => {
                  setRecipient(e.target.value);
                }}
              />
            </InputGroup>

            <InputGroup className="mb-3" size="sm">
              <FormControl
                placeholder="Transfer amount (Default 0)"
                aria-label="Transfer Amount"
                aria-describedby="basic-addon2"
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                }}
              />

              <InputGroup.Text id="basic-addon2">SAI</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <Button
                variant="primary"
                style={{ width: "100%" }}
                size="sm"
                onClick={TransferFundHandler}
              >
                Transfer Funds
              </Button>
            </InputGroup>
            {/* <button className="btn1" onClick={() => {}}>Transfer Funds</button> */}
          </Card.Body>
        </Card>
        <Card className="text-center" border="info">
          <Card.Header>
            <h5>Transactions</h5>
          </Card.Header>
          <Card.Body>
            {/* <Card.Title>Transactions</Card.Title> */}
            <div className="table-responsive">
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Recipient</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={index}>
                      <td>{t.event}</td>
                      <td>{t.returnValues[1]}</td>
                      <td>{web3.utils.fromWei(t.returnValues[2])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default EthWallet;
