import React, { Component } from 'react';
import FotoItem from './FotoItem';
import PubSub from 'pubsub-js';
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
    PubSub.subscribe('timeline', (topico, fotos) => {
      this.setState({
        fotos
      });
    });
    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
      fotoAchada.likeada = !fotoAchada.likeada;
      const possivelLiker = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);
      if (possivelLiker === undefined) {
        fotoAchada.likers.push(infoLiker.liker);
      } else {
        const novosLikers = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login);
        fotoAchada.likers = novosLikers;
      }
      this.setState({
        fotos: this.state.fotos
      });
    })
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
    fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível realizar o like da foto');
        }
      })
      .then(liker => {
        PubSub.publish('atualiza-liker', {
          fotoId: fotoId,
          liker
        });
      });
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
          { this.state.fotos.map(foto => <FotoItem key={ foto.id } foto={ foto } like={ this.like } comenta={ this.comenta } />) }
        </CSSTransitionGroup>
      </div>
      );
  }
}