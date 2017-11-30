import React, { Component } from 'react';
import FotoItem from './FotoItem';

export default class Timeline extends Component {
  render() {
    return(
      <div className="fotos container">
        <FotoItem />
        <FotoItem />
        <FotoItem />
      </div>
    );
  }
}