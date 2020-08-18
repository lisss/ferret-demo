import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { Chart } from './chart';
import { TalkComments } from './talk';
import { Header } from './header';
import './index.css';
import { Home } from './home';

ReactDOM.render(
  <Router>
    <Header />
    <Switch>
      <Route exact path="/">
        <div className="mainWrap">
          <Home />
        </div>
      </Route>
      <Route path="/chart">
        <div className="mainWrap">
          <Chart />
        </div>
      </Route>
      <Route path="/comments">
        <div className="mainWrap">
          <TalkComments />
        </div>
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
