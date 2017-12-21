import React, { Component } from 'react';
import FotoItem from './FotoItem';
import PubSub from 'pubsub-js';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import LogicaTimeline from '../logicas/LogicaTimeline';

export default class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fotos: []
    };
    this.login = this.props.login;
    this.logicaTimeline = new LogicaTimeline([]);
  }

  componentWillMount() {
    PubSub.subscribe('timeline', (topico, fotos) => {
      this.setState({
        fotos
      });
    });
    PubSub.subscribe('novos-comentarios', (topico, infoComentario) => {
      const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId)
      fotoAchada.comentarios.push(infoComentario.novoComentario);
      this.setState({
        fotos: this.state.fotos
      });
    });
  }

  carregaFotos() {
    let urlPerfil;

    if (this.login === undefined) {
      urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
    }

    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.setState({
          fotos: fotos
        });
        this.logicaTimeline = new LogicaTimeline(fotos);
      });
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
    this.logicaTimeline.like(fotoId);
  }

  comenta(fotoId, textoCometario) {
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        texto: textoCometario
      }),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    }

    fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível comentar');
        }
      })
      .then(novoComentario => {
        PubSub.publish('novos-comentarios', {
          fotoId: fotoId,
          novoComentario
        });
      })
  }

  render() {
    return (
      <div className="fotos container">
        <CSSTransitionGroup transitionName="timeline" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 300 }>
          { this.state.fotos.map(foto => <FotoItem key={ foto.id } foto={ foto } like={ this.like.bind(this) } comenta={ this.comenta } />) }
        </CSSTransitionGroup>
      </div>
      );
  }
}