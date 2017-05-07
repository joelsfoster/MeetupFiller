import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';


export default class RsvpPayment extends React.Component {
  componentWillMount() {
    let url = '';
    Meteor.call('generatePaypalPortal', {}, (error, response) => {
      if (error) {
        console.warn(error.reason);
      } else {
        url = response;
        window.location.href = url;
      }
    });
  }

  render() {
    return (
      <div className="RsvpPayment">
        <Loading />
      </div>
    );
  }
}
