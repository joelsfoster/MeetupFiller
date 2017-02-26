import React from 'react';
import { Jumbotron } from 'react-bootstrap';

const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>Pickup Soccer</h2>
      <p>Organizers: host full pickup games. Players: Get discounts on pickup games.</p>
      <p><a className="btn btn-success" href="https://themeteorchef.com/base" role="button">Read the Base Documentation</a></p>
      <p style={ { fontSize: '16px', color: '#aaa' } }>Currently under construction.</p>
    </Jumbotron>
  </div>
);

export default Index;
