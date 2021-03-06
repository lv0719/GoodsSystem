import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';
import './App.css';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';


export default class App extends Component {
  render(){
    return( 
       <BrowserRouter> 
        <Switch> {/*只匹配其中一个 */}
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={Admin}></Route>
       </Switch>
      </BrowserRouter>
    )
  }
}