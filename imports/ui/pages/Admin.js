import React from 'react';
import { Row, Col, Form, Button, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';


export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: ''};
  }

  _handleSubmit(event) {
    event.preventDefault();

    // When _handleSubmit is called, use papaParse to make a JSON object out of the CSV...
    const csvFile = this.state.file;
    Papa.parse(csvFile, {
      header: true,
    	complete: (results) => {

        //...then pass the results into the uploadPaypalMembers Meteor method.
        Meteor.call('uploadPaypalMembers', results, (error, response) => {
          if (error) {
            console.log("Error at uploadPaypalMembers");
            alert("Error at uploadPaypalMembers. File did not upload.");
            console.warn(error.reason);
          } else {
            alert("File successfully uploaded!");
          }
        });
    	}
    });
  }

  _handleFileUpload(event) {
    event.preventDefault();

    let file = event.target.files[0];
    console.log(file);

    this.setState({
      file: file
    });
  }

  render() {

    return (
      <div className="Admin">
        <Row>
          <Col xs={ 12 }>
            <div className="page-header clearfix">
              <h3 className="pull-left">Admin</h3>
            </div>
            <div className="paypal-uploader">
              <Form inline onSubmit={(event)=>this._handleSubmit(event)}>
                <FormGroup>
                  <ControlLabel>PayPal Member Uploader</ControlLabel>
                  <FormControl type="file" accept=".csv" onChange={(event)=>this._handleFileUpload(event) }/>
                </FormGroup>
                <p><i>Ensure the uploaded CSV has a header row with these three column names: <b>organizationID | userID | paymentEmail</b></i></p>
                <Button type="submit" bsStyle="success" onClick={ (event)=>this._handleSubmit(event) }>
                  Upload Data
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
