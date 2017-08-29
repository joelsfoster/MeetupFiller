import React from 'react';


const Features = React.createClass({
  render: () => {
    return (

      <section className="features" id="features">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Automated Discounting System</h2>
            <p className="text-muted">MeetupFiller detects open spots in upcoming events, then emails eligible members a discounted RSVP link</p>
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
                      <h3>Total Flexibility</h3>
                      <p className="text-muted">Set up and customize your group's discounting strategy, then enjoy full hands-off automation</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-user-following text-primary icon" />
                      <h3>Member-Friendly</h3>
                      <p className="text-muted">Discounts appear sent from you, with the event's information and a "Click to RSVP using this discount" link</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-lock text-primary icon" />
                      <h3>Secure Payments</h3>
                      <p className="text-muted">Members pay through PayPal (same experience as Meetup's), which is then sent to your PayPal account weekly</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-wallet text-primary icon" />
                      <h3>Guaranteed Profit</h3>
                      <p className="text-muted">We only charge a percentage of the revenue we generate for you, so you'll only ever make money</p>
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
