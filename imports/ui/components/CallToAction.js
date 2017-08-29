import React from 'react';
import { Button } from 'react-bootstrap';


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

  handleSubmit(event) {
    if (this.state.name !== "" && (this.state.email !== "" && this.state.url !== "")) {
      console.log("Successfully submitted:", this.state.name, this.state.email, this.state.url);
      this.setState({thankYouMessage: true});
    } else {
      console.warn("Not all fields filled out");
      event.preventDefault();
    }
  }

  renderCallToAction() {
    if (this.state.thankYouMessage === false) {
      return (
        <div className="default-message">
          <h2>
            Maximize your Meetup's potential.<br />
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
            We've sent you a confirmation email, and will be in touch shortly.<br />
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
