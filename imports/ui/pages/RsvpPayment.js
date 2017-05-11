import React from 'react';
import { Meteor } from 'meteor/meteor';
import Loading from '../components/Loading.js';
import DiscountLog from '../../api/discountLog/discountLog.js';


export default class RsvpPayment extends React.Component {
  componentWillMount() {
    const _id = this.props.params._id;

    Meteor.subscribe('getDiscountID', _id, () => {
      const discount = DiscountLog.findOne();

      Meteor.call('generatePaypalPortal', _id, (error, url) => {
        if (error) {
          console.warn(error.reason);
        } else {
          console.log(url);
          window.location.href = url;
        }
      });

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
