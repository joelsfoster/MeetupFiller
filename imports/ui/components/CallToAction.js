import React from 'react';


const CallToAction = React.createClass({
  render: () => {
    return (

      <section className="cta" id="cta">
        <div className="cta-content">
          <div className="container">
            <h2>Stop waiting.<br />Start building.</h2>
            <a href="#contact" className="btn btn-outline btn-xl js-scroll-trigger">Let's Get Started!</a>
          </div>
        </div>
        <div className="overlay" />
      </section>
    );
  }
});

export default CallToAction;
