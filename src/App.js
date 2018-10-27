import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChromeExtensionConnector from './ChromeExtensionConnector';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ChromeExtensionConnector />
      </div>
    );
  }
}

export default App;
