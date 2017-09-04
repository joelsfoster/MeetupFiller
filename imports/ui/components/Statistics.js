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
            <p className="text-muted">Over 35% of all Meetup members attend a group's event once, and never return</p>
            <hr />
          </div>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <div className="container-fluid">
                <div className="row">
                  <div className="info-block">
                    <h3>Your Meetup Looks Like This</h3>
                    <p className="text-muted">In the past year, over 70% of your members attended 5 or fewer events</p>
                  </div>
                </div>
                <MediaQuery maxDeviceWidth={992}>
                  <div className="col-lg-8 my-auto statistics-mobile">
                    <img src="img/statistics-mobile.png" className="img-fluid" alt />
                  </div>
                </MediaQuery>
                <div className="row">
                  <div className="info-block">
                    <h3>Regulars Keep Meetups Alive</h3>
                    <p className="text-muted">One regular member benefits your community more than 10 visitors</p>
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
