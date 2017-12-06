import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Route } from 'react-router-dom';

export default class Logout extends Component {
  componentWillMount() {
    localStorage.removeItem('auth-token');
    browserHistory.push('/');
    <Route path='/' />
  }

  render() {
    return null;
  }
}