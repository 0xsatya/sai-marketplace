import React from "react";

function EthTest() {
  return (
    <div className="moduleCard">
      <div className="moduleCardHeading">
        <h5>My Ether Wallet</h5>
      </div>
      <div className="moduleCardData">
        <div className="myCustomInputs">
          <input type="text" placeholder="data"></input>
          <div class="input-group ">
            <span class="input-group-text" id="addon-wrapping">
              @
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div class="input-group ">
            <span class="input-group-text" id="addon-wrapping">
              @
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="addon-wrapping"
            />
          </div>
          <div class="input-group ">
            <span class="input-group-text" id="addon-wrapping">
              @
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="addon-wrapping"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EthTest;
