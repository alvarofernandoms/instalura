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

  carregaFotos() {
    let urlPerfil;
    if (this.login === undefined) {
      urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}}`;
    }
    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.setState({
          fotos: fotos
        });
      });
  }

  componentDidMount() {
    if (localStorage.getItem('auth-token') === null) {
      console.log('não logado');
      // this.context.history.push('/');
      <Redirect to={ { pathname: '/', state: { from: this.props.location } } } />
    } else {
      this.carregaFotos();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== undefined) {
      this.login = nextProps.login;
      this.carregaFotos();
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