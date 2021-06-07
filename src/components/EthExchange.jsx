import Button from "react-bootstrap/Button";
import React from "react";
import { FormControl, InputGroup } from "react-bootstrap";

function EthExchange() {
  return (
    <div className="moduleCard">
      <div className="moduleCardHeading"><h5>My SAI Exchange</h5></div>
      <div className="moduleCardData">
      <InputGroup className="lg-3" size="sm">
        <FormControl
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button variant="primary" size="sm">Send</Button>
        </InputGroup.Append>
      </InputGroup>
      <InputGroup className="lg-3" size="sm">
        <FormControl
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button variant="primary" size="sm">Send</Button>
        </InputGroup.Append>
      </InputGroup>
      </div>
      
    </div>
  );
}

export default EthExchange;
