import React from 'react';
import { Jumbotron } from 'react-bootstrap';

const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>PickupBaller</h2>
      <p>Organize pickup soccer games? Never have an unfilled spot ever again.</p>
      <p>Play pickup soccer? Score discounts on games based off how many spots are available.</p>
      <p><a className="btn btn-success" href="https://themeteorchef.com/base" role="button">Read the Base Documentation</a></p>
      <p style={ { fontSize: '16px', color: '#aaa' } }>Currently under construction.</p>
    </Jumbotron>
  </div>
);

export default Index;
