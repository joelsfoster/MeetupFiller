import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import NavBar from '../components/NavBar.js';
import MastHead from '../components/MastHead.js';
import DownloadNow from '../components/DownloadNow.js';
import Features from '../components/Features.js';
import TestimonialsAndPricing from '../components/TestimonialsAndPricing.js';
import CallToAction from '../components/CallToAction.js';
import Contact from '../components/Contact.js';
import Footer from '../components/Footer.js';


const Index = () => (
  <div className="index">
    { /* <NavBar /> */ }
    <MastHead />
    <Features />
    <TestimonialsAndPricing />
    { /* <DownloadNow /> */ }
    <CallToAction />
    { /* <Contact /> */ }
    <Footer />
  </div>
);

export default Index;
