import React from 'react';

const NavBar = React.createClass({
  render: () => {
    return (

      <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div className="container">
          <a className="navbar-brand js-scroll-trigger logo" href="#"><h1>meetupfiller</h1></a>
          { /*
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i className="fa fa-bars"></i>
          </button>
          */ }
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              { /*
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#download">Download</a>
              </li>
              */ }
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#cta">Get Started</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

export default NavBar;
