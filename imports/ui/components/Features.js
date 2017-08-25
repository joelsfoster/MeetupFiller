import React from 'react';


const Features = React.createClass({
  render: () => {
    return (

      <section className="features" id="features">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Completely Automated</h2>
            <p className="text-muted">Detects open spots in upcoming events, then sends individual members special discounts via email</p>
            <hr />
          </div>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <div className="device-container">
                <div className="device-mockup iphone6_plus portrait white">
                  <div className="device">
                    <div className="screen">
                      {/* Demo image for screen mockup, you can put an image here, some HTML, an animation, video, or anything else! */}
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
                      <i className="icon-screen-smartphone text-primary" />
                      <h3>Device Mockups</h3>
                      <p className="text-muted">Ready to use HTML/CSS device mockups, no Photoshop required!</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-camera text-primary" />
                      <h3>Flexible Use</h3>
                      <p className="text-muted">Put an image, video, animation, or anything else in the screen!</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-present text-primary" />
                      <h3>Free to Use</h3>
                      <p className="text-muted">As always, this theme is free to download and use for any purpose!</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-lock-open text-primary" />
                      <h3>Open Source</h3>
                      <p className="text-muted">Since this theme is MIT licensed, you can use it commercially!</p>
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
