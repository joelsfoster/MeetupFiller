import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import MastHead from '../components/MastHead.js';
import DownloadNow from '../components/DownloadNow.js';
import Features from '../components/Features.js';
import CallToAction from '../components/CallToAction.js';
import Contact from '../components/Contact.js';
import Footer from '../components/Footer.js';


const Index = () => (
  <div className="index">
    <MastHead />
    { /* <DownloadNow /> */ }
    <Features />
    <CallToAction />
    { /* <Contact /> */ }
    <Footer />

    <Grid>
      <Row className="green-grid-section">
        <Col xs={12} md={6}>Fully automated--no need to manually send "still some spots available" emails anymore</Col>
        <Col xs={12} md={6}>Customize it however you like to run your organization--choose to send discounts only to long-lost members, or set different discount rates depending on how empty the event is</Col>
      </Row>
      <Row className="blue-grid-section">
        <Col xs={12} md={4}>PS2G logo</Col>
        <Col xs={12} md={8}>Play Soccer 2 Give makes an extra $200/month, allowing them to donate more to their charity partners</Col>
        <Col xs={12} md={4}>Futsal Across America logo</Col>
        <Col xs={12} md={8}>Futsal Across America were able to consistently fill all their events, building up the group and allowing for more events to be hosted</Col>
      </Row>
      <Row className="green-grid-section">
        <Col xs={12} md={12}>18% of post-discount amount. Example: If a $8 event is discounted to $5, we take $5 * 18% = $0.90</Col>
      </Row>
      <Row className="blue-grid-section">
        <Col xs={8} md={8}>"How much are you losing out on? Check for free, instantly! No need to sign up. (fill out form with API key and organizationID)"</Col>
        <Col xs={4} md={4}><Button bsStyle="primary">Learn more</Button></Col>
        <Col xs={6} md={6}>"If each empty spot was filled using a 25% discount, you could have made up to $1000"</Col>
        <Col xs={6} md={6}>"Sign up now! MeetupFiller only takes a percentage of the money it makes you--that way, you're not charged if no discounts were used"</Col>
      </Row>
    </Grid>
  </div>
);

export default Index;
