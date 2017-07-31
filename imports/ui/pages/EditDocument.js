import React from 'react';
import DocumentEditor from '../components/DocumentEditor.js';
import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import Documents from '../../api/documents/documents.js';
import Loading from '../components/Loading.js';


const EditDocument = ({ doc }) => (
  <div className="EditDocument">
    <h4 className="page-header">Editing "{ doc.title }"</h4>
    <DocumentEditor doc={ doc } />
  </div>
);

EditDocument.propTypes = {
  doc: React.PropTypes.object,
};

const composer = ({ params }, onData) => {
  const subscription = Meteor.subscribe('documents.view', params._id);

  if (subscription.ready()) {
    const doc = Documents.findOne();
    onData(null, { doc });
  }
};

export default composeWithTracker(composer, Loading)(EditDocument);
