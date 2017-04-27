import React from 'react';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents.js';
import Loading from './Loading.js';

// When called, navigate user to the document's ViewDocument.js page
const handleNav = (_id) => {
  browserHistory.push(`/documents/${_id}`);
}

// Rendered component
const DocumentsList = ({ documents }) => (
  documents.length > 0 ? <ListGroup className="DocumentsList">
    {documents.map(({ _id, title }) => (
      <ListGroupItem key={ _id } onClick={ () => handleNav(_id) }>
        { title }
      </ListGroupItem>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No documents yet.</Alert>
);

// What data type the component is expecting
DocumentsList.propTypes = {
  documents: React.PropTypes.array,
};

// The container, used to pass subscription data into the component
const composer = (params, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find().fetch();
    onData(null, { documents });
  }
};

// This DocumentsList (fed with this container's data) is what gets used in other React pages/components
export default composeWithTracker(composer, Loading)(DocumentsList);
