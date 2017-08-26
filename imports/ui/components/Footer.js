import React from 'react';


const Footer = React.createClass({
  render: () => {
    return (

      <footer>
        <div className="container">
          <img src="img/made_in_nyc.png" className="img-fluid" alt width="82"/>
          <p><br /></p>
          <p>© 2017 MeetupFiller</p>
          { /*
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="#">Privacy</a>
            </li>
            <li className="list-inline-item">
              <a href="#">Terms</a>
            </li>
            <li className="list-inline-item">
              <a href="#">FAQ</a>
            </li>
          </ul>
          */ }
        </div>
      </footer>
    );
  }
});

export default Footer;
