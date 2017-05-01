import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';


export default class RsvpPayment extends React.Component {
  componentWillMount() {
    // handlePayment();
  }

  handleSubmit(event) {
    // event.preventDefault();
  }

  render() {
    return (
      <div className="RsvpPayment">
        <Row>
          <Col xs={ 12 }>
            <div className="page-header clearfix">
              <h4 className="pull-left">RSVP to "Thurs 6:45pm @ Upper90"</h4>
              <h5 className="pull-right">hosted by PlaySoccer2Give</h5>
            </div>
          <div className="paypal">
            <p>[This is where the interface will go]</p>
          </div>
          </Col>
        </Row>
      </div>
    );
  }
}
