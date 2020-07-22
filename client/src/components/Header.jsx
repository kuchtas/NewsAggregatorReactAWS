import React from "react";
import { Navbar } from "reactstrap";

const Header = () => {
  return (
    <div>
      <Navbar color="primary" className="justify-content-center">
        <h2
          className="text-white text-center"
          style={{
            fontSize: "calc(1em + 1vw)",
          }}
        >
          Wyszukiwarka newsów
        </h2>
      </Navbar>
    </div>
  );
};

export default Header;
