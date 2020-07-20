import React from "react";
import { Navbar } from "reactstrap";

const Header = () => {
  return (
    <div>
      <Navbar color="primary" className="justify-content-center">
        <h2 className="text-white">Wyszukiwarka artykułów</h2>
      </Navbar>
    </div>
  );
};

export default Header;
