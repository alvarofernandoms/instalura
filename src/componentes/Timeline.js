import React, { Component } from 'react';
import FotoItem from './FotoItem';
import Login from './Login';
import { Redirect, Route, Switch } from 'react-router-dom';

export default class Timeline extends Component {

  constructor() {
    super();
    this.state = {
      fotos: []
    };
  }

  componentDidMount() {
    if (localStorage.getItem('auth-token') === null) {
      console.log('não logado');
      this.context.history.push('/');
    } else {
      fetch(`http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`)
        .then(response => response.json())
        .then(fotos => {
          this.setState({
            fotos: fotos
          });
        });
    }
  }

  render() {
    return (
      <div className="fotos container">
        { this.state.fotos.map(foto => <FotoItem key={ foto.id } foto={ foto } />) }
      </div>
      );
  }
}