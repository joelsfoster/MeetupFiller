import React from 'react';
import { Grid } from 'react-bootstrap'; // Need to learn more about this!
import AppNavigation from '../components/AppNavigation.js';

// The App displays the navigation bar (which is ever-present),
// and a bootstrap grid is given children (is that an object??) to display...
const App = ({ children }) => (
  <div>
    { /* <AppNavigation /> */ }
    <Grid>
      { children }
    </Grid>
  </div>
);

// ... which are "node"-types. What the heck does that mean?
App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
