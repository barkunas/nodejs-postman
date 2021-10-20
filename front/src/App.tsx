import React from 'react'
import logo from './logo.svg'
import planet from './planet.png'
import './App.css'
import Form from './components/Form'

//const logo = logoSVG as string;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
        </p>
      </header>
      <Form />
      <img src={planet} className="App-logo" alt="logo" />
    </div>
  );
}

export default App;
