import React from "react";
import ReactDOM from "react-dom";
import './index.css';
import App from './App.js';
import * as serviceWorker from './serviceWorker';

fetch('/api/').then(response => {
  //console.log("react！！"); //response.json());
})

export const Index = () => {
  return <div > Hello React! < /div>;
};

//ReactDOM.render(<Index />, document.getElementById("index"));
ReactDOM.render( < App / > , document.getElementById('root'));
