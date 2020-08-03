import React from "react";
import { Container, FormGroup, Label, Input } from "reactstrap";
import wprostLogo from "../logos/wprost-favicon-512x512.png";
import dziennikLogo from "../logos/dziennik.jpg";
import okoLogo from "../logos/oko.jpg";
import niezaleznaLogo from "../logos/niezalezna.jpg";
import "../styles/filterStyles.css";

const Filter = ({ filterState, onChange }) => {
  return (
    <Container className=" mt-3 d-flex justify-content-around">
      <FormGroup check inline>
        <Label check>
          <Input
            type="checkbox"
            id="WPROST"
            checked={filterState.WPROST}
            onChange={onChange}
          />{" "}
          <img className="filter" src={wprostLogo} alt="Wprost logo" />
        </Label>
      </FormGroup>
      <FormGroup check inline>
        <Label check>
          <Input
            type="checkbox"
            id="DZIENNIK"
            checked={filterState.DZIENNIK}
            onChange={onChange}
          />{" "}
          <img className="filter" src={dziennikLogo} alt="Wprost logo" />
        </Label>
      </FormGroup>
      <FormGroup check inline>
        <Label check>
          <Input
            type="checkbox"
            id="OKO"
            checked={filterState.OKO}
            onChange={onChange}
          />{" "}
          <img className="filter" src={okoLogo} alt="Wprost logo" />
        </Label>
      </FormGroup>
      <FormGroup check inline>
        <Label check>
          <Input
            type="checkbox"
            id="NIEZALEZNA"
            checked={filterState.NIEZALEZNA}
            onChange={onChange}
          />{" "}
          <img className="filter" src={niezaleznaLogo} alt="Wprost logo" />
        </Label>
      </FormGroup>
    </Container>
  );
};

export default Filter;
