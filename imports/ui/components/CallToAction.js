import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';


export default class CallToAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      url: "",
      thankYouMessage: false
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handleUrlChange(event) {
    this.setState({url: event.target.value});
  }

  // On submit, if all fields are filled in, send a confirmation email
  handleSubmit(event) {
    if (this.state.name !== "" && (this.state.email !== "" && this.state.url !== "")) {
      const name = this.state.name;
      const email = this.state.email;
      const url = this.state.url;

      Meteor.call('signupConfirmationEmail', name, email, url, (error, response) => {
        if (error) {
          console.log("Error at signupConfirmationEmail");
          console.log(error.reason);
        } else {
          this.setState({thankYouMessage: true});
        }
      });
    } else {
      Bert.alert({
        message: "Whoops! Not all fields are filled out.",
        type: 'warning',
      });
      event.preventDefault();
    }
  }

  renderCallToAction() {
    if (this.state.thankYouMessage === false) {
      return (
        <div className="default-message">
          <h2>
            Grow your community.<br />
            Get started now!
          </h2>
          <div className="form">
            <div className="form-group">
              <input className="form-control" type="text" placeholder="Name" value={this.state.name} onChange={ this.handleNameChange} />
              <input className="form-control" type="email" placeholder="Email" value={this.state.email} onChange={ this.handleEmailChange} />
            </div>
            <div className="form-group">
              <input className="form-control" type="text" placeholder="Your Meetup Page URL" value={this.state.url} onChange={ this.handleUrlChange} />
              <small>Example: www.meetup.com/your-meetup-group</small>
            </div>
            <button className="btn btn-outline btn-xl js-scroll-trigger" onClick={ event => this.handleSubmit(event) }>Get Started</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="thank-you-message">
          <h2>
            Thank you so much!<br />
            We've sent you a confirmation email and will be in touch shortly.<br />
          </h2>
        </div>
      )
    }
  }

  render() {
    return (
      <section className="cta" id="cta">
        <div className="cta-content">
          <div className="container">
            { this.renderCallToAction() }
          </div>
        </div>
        <div className="overlay" />
      </section>
    );
  };
};
