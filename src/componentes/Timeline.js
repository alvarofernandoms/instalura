import React, { Component } from 'react';
import FotoItem from './FotoItem';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

export default class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fotos: []
    };
    this.login = this.props.login;
  }

  componentWillMount() {
    this.props.store.subscribe(fotos => {
      this.setState({fotos});
    })
  }

  carregaFotos() {
    let urlPerfil;

    if (this.login === undefined) {
      urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
    }
    this.props.store.lista(urlPerfil);
  }

  componentDidMount() {
    this.carregaFotos();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== undefined) {
      this.login = nextProps.login;
      this.carregaFotos();
    }
  }

  like(fotoId) {
    this.props.store.like(fotoId);
  }

  comenta(fotoId, textoCometario) {
    this.props.store.comenta(fotoId, textoCometario);
  }

  render() {
    return (
      <div className="fotos container">
        <CSSTransitionGroup transitionName="timeline" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 300 }>
          { this.state.fotos.map(foto => <FotoItem key={ foto.id } foto={ foto } like={ this.like.bind(this) } comenta={ this.comenta.bind(this) } />) }
        </CSSTransitionGroup>
      </div>
      );
  }
}