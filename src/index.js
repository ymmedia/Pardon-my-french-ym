import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'proxy-polyfill'
import 'core-js/fn/array/from';
import 'core-js/fn/array/find';
import 'core-js/fn/array/find-index';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/entries';
import 'core-js/fn/promise';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/string/ends-with';
import 'core-js/fn/symbol/for';
import 'core-js/fn/weak-set';
import 'core-js/fn/set';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary';
import { HashRouter as Router } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
     <Router>
       <App />
    </Router> ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
