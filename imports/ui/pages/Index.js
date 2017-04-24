import React from 'react';
import { Jumbotron } from 'react-bootstrap';

// Where does the CSS come from? Looks in-line to me. This is where my landing page would live.
const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>MeetupFiller</h2>
      <p>Never host a half-filled Meetup again.</p>
      <p style={ { fontSize: '16px', color: '#aaa' } }>Currently under construction.</p>
    </Jumbotron>
  </div>
);

export default Index;
