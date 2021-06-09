import Button from "react-bootstrap/Button";
import React from "react";
import { Card, FormControl, InputGroup } from "react-bootstrap";

function EthExchange() {
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
            }}
          >
            Buy
          </button>
          {/* <span>{"<"}{">"}</span> */}
          <div class="swapSelector">
            {'<'} ETH-SAI {'>'}
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              //sell token
            }}
          >
            {" "}
            Sell
          </button>
        </div>
        <div class="card">
          <div class="card-header text-center">
            <h6>Buy Token</h6>
          </div>
          <div class="card-body">
            <div className="childJustifyBetweeninRow">
              <h6>Input</h6> <span>Balance:$10</span>
            </div>

            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="input" />
              <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">
                  <div
                    className="saiLogoSmallDiv"
                    style={{ backgroundImage: 'url("sailogo.png")' }}
                  ></div>
                  SAI
                </span>
              </div>
            </div>
            <div className="childJustifyBetweeninRow">
              <h6>Output</h6> <span>Balance:$10</span>
            </div>

            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="output"
                disabled
              />
              <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">
                  <div
                    className="saiLogoSmallDiv"
                    style={{ backgroundImage: 'url("ethericon.png")' }}
                  ></div>
                  ETH
                </span>
              </div>
            </div>
            <div className="childJustifyBetweeninRow smallFont">
              <span class="card-title">Exchange Rate</span>{" "}
              <span class="card-title">1ETH = 20SAI</span>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              style={{ width: "100%" }}
            >
              SWAP
            </button>
            <p class="card-text smallFont red">
              Caution: Don't use the app in ethereum mainnet else you may loose
              money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EthExchange;
