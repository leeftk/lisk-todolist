import React from 'react';
import { Component } from 'react';
import Hello from './components/hello'
import Faucet from './components/Faucet'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render(){
  return (
    <div className="App">
      <Hello />
      <Faucet />
    </div>
  );
  }
}


export default App;
