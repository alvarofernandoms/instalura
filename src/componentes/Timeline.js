import React, { Component } from 'react';
import FotoItem from './FotoItem';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import TimelineApi from '../logicas/TimelineApi';
import { connect } from 'react-redux';

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.login = this.props.login;
  }

  carregaFotos() {
    let urlPerfil;

    if (this.login === undefined) {
      urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
    }
    this.props.lista(urlPerfil);
  }

  componentDidMount() {
    this.carregaFotos();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== this.login) {
      this.login = nextProps.login;
      this.carregaFotos();
    }
  }

  render() {
    return (
      <div className="fotos container">
        <CSSTransitionGroup transitionName="timeline" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 300 }>
          { this.props.fotos.map(foto => <FotoItem key={ foto.id } foto={ foto } like={ this.props.like } comenta={ this.props.comenta } />) }
        </CSSTransitionGroup>
      </div>
      );
  }

}
const mapStateToProps = state => {
  return {
    fotos: state.timeline
  }
};

const mapDispatchToProps = dispatch => {
  return {
    like: (fotoId) => {
      dispatch(TimelineApi.like(fotoId));
    },

    comenta: (fotoId, textoCometario) => {
      dispatch(TimelineApi.comenta(fotoId, textoCometario));
    },

    lista: (urlPerfil) => {
      dispatch(TimelineApi.lista(urlPerfil));
    }
  }
}

const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimelineContainer;