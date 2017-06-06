import React from 'react';
import { Jumbotron } from 'react-bootstrap';


const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>MeetupFiller</h2>
      <p>Never host a half-filled Meetup again.</p>
      <p style={ { fontSize: '16px', color: '#aaa' } }>Currently in private beta. If you've received an invitation key, refer to your invitation email for instructions.</p>
    </Jumbotron>
  </div>
);

export default Index;
