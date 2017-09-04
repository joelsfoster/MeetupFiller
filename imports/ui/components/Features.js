import React from 'react';


const Features = React.createClass({
  render: () => {
    return (

      <section className="features" id="features">
        <div className="container">
          <div className="section-heading text-center">
            <hr />
            <h2>MeetupFiller Retains Your Members</h2>
            <p className="text-muted">Automatically detects open spots in upcoming events, then sends reminder emails with a link to RSVP using a discount</p>
            <hr />
          </div>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <div className="device-container">
                <div className="device-mockup iphone6_plus portrait white">
                  <div className="device">
                    <div className="screen">
                      <img src="img/filled_meetup.png" className="img-fluid" alt />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 my-auto">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-wrench text-primary icon" />
                      <h3>Customizable Discounts</h3>
                      <p className="text-muted">Target infrequent visitors with special discounts to bring them back until they become regulars</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-user-following text-primary icon" />
                      <h3>Totally Automated</h3>
                      <p className="text-muted">Spend your time focusing on your events, instead of worrying about getting people to attend them</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-lock text-primary icon" />
                      <h3>Secure Payments</h3>
                      <p className="text-muted">Members RSVP through PayPal (same experience as Meetup), which is then paid out to your PayPal account</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-wallet text-primary icon" />
                      <h3>Guaranteed Profit</h3>
                      <p className="text-muted">MeetupFiller only takes a percentage of the revenue it makes you, so you only pay if it works!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

export default Features;
