import React from 'react';

const MastHead = React.createClass({
  render: () => {
    return (

      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-7 my-auto">
              <div className="header-content mx-auto">
                <h1 className="mb-5"><b>Unfilled Meetups are costing you.</b><br />Prevent lost dollars by selling empty spots at a discount!</h1>
                <a href="#cta" className="btn btn-outline btn-xl js-scroll-trigger">Fill your Meetups now</a>
              </div>
            </div>
            <div className="col-lg-5 my-auto">
              <div className="device-container">
                <div className="device-mockup iphone6_plus portrait white">
                  <div className="device">
                    <div className="screen">
                      {/* Demo image for screen mockup, you can put an image here, some HTML, an animation, video, or anything else! */}
                      <img src="img/unfilled_meetup.png" className="img-fluid" alt />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
});

export default MastHead;
