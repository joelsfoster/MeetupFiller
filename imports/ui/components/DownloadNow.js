import React from 'react';


const DownloadNow = React.createClass({
  render: () => {
    return (

      <section className="download bg-primary text-center" id="download">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <h2 className="section-heading">Discover what all the buzz is about!</h2>
              <p>Our app is available on any mobile device! Download now to get started!</p>
              <div className="badges">
                { /* took out the images here cuz they wouldnt render */ }
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

export default DownloadNow;
