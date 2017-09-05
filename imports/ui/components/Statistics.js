import React from 'react';
import MediaQuery from 'react-responsive';


const Statistics = React.createClass({
  render: () => {
    return (

      <section className="statistics" id="statistics">
        <div className="container">
          <div className="section-heading text-center">
            <h2>
              Attracting new members is not the problem.<br />
              Getting them to come back is.
            </h2>
            <p className="text-muted">One in three Meetup visitors never come back for a second event</p>
            <hr />
          </div>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <div className="container-fluid">
                <div className="row">
                  <div className="info-block">
                    <h3>Meetups Need to Become More "Sticky"</h3>
                    <p className="text-muted">Even in the most popular groups, over 80% of members attend fewer than 5 events a year!</p>
                  </div>
                </div>
                <MediaQuery maxDeviceWidth={992}>
                  <div className="col-lg-8 my-auto statistics-mobile">
                    <img src="img/statistics-mobile.png" className="img-fluid" alt />
                  </div>
                </MediaQuery>
                <div className="row">
                  <div className="info-block">
                    <h3>Regulars Keep Communities Alive</h3>
                    <p className="text-muted">A friendly environment and strong culture are what newcomers say bring them back</p>
                  </div>
                </div>
              </div>
            </div>
            <MediaQuery minDeviceWidth={992}>
              <div className="col-lg-8 my-auto">
                <img src="img/statistics.png" className="img-fluid" alt />
              </div>
            </MediaQuery>
          </div>
        </div>
      </section>
    );
  }
});

export default Statistics;
