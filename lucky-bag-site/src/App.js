import React, { Component } from 'react';

import './App.css';
import Logo from "./components/Logo/Logo";
import ManageBags from "./containers/ManageBags/ManageBags";
import Transactions from "./containers/Transactions/Transactions";

class App extends Component {

  render() {

    return (

      <div className="App">
        <Logo />
        <ManageBags />
        <Transactions />
      </div>
    );
  }
}

export default App;
