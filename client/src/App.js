import React, { useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import {
  Container, Menu,
} from 'semantic-ui-react';
import { createGlobalStyle } from 'styled-components';

import TestForm from './components/Form';
import ControlledModal from './components/Modal';


const GlobalStyle = createGlobalStyle`
  body, input, small, p, button {
    font-family: 'Libre Franklin', sans-serif !important;
  }

  h1, h2, h3, h4, a {
    font-family: 'Fjalla One', sans-serif !important;
  }

  body {
    background-color: #d3dfab;
  }

  .container {
    background-color: white;
    padding: 30px 50px;
  }

  h1 {
    border-top: 30px solid #52c2c8;
    display: inline;
  }

  .green {
    color: #9bb645 !important;
  }

  a.item.active {
    color: #52c2c8 !important;
    border-color: #52c2c8 !important;
  }
`;

const Navigation = () => (
  <Menu pointing secondary>
    <Menu.Menu position="right">
      <Menu.Item as={NavLink} exact name="home" to="/">
        HOME
      </Menu.Item>
      <Menu.Item as={NavLink} name="about" to="/about">
        ABOUT THIS GAME
      </Menu.Item>
      <Menu.Item as={NavLink} exact name="calculator" to="/calculator">
        CALCULATOR
      </Menu.Item>
      <Menu.Item as={NavLink} name="assumptions" to="/assumptions">
        OUR ASSUMPTIONS
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);


function App() {
  const [_, setData] = useState([]); // move to redux?
  const [modalState, setState] = useState({ modalOpen: false });

  const handleOpen = results => setState({ modalOpen: true, results });

  const handleClose = () => setState({ modalOpen: false });

  const handleSubmit = (values) => {
    axios.post('/api', { data: values })
      .then((response) => {
        const payArray = [];
        const normalCostArray = [];
        const ualArray = [];
        const pobArray = [];
        response.data.forEach(({
          // eslint-disable-next-line camelcase
          normal_cost, ual, sual, pob, payment, year,
        }) => {
          pobArray.push({
            pob: pob || 0,
            year: year.toString(),
          });

          payArray.push({
            payment,
            year: year.toString(),
          });

          normalCostArray.push({
            normal_cost,
            year: year.toString(),
          });

          ualArray.push({
            ual,
            year: year.toString(),
          });
        });

        const results = {
          payArray,
          pobArray,
          normalCostArray,
          ualArray,
        };

        setData(results);
        handleOpen(results);
      })
      .catch((error) => {
        throw error;
      });
  };


  return (
    <Router>
      <GlobalStyle />
      <Container style={{ margin: 20 }}>
        <h1>PERS Tool</h1>

        <Navigation />

        <Route path="/" exact component={() => <div>Profile</div>} />
        <Route path="/calculator" component={() => <TestForm onSubmit={handleSubmit} />} />
        <Route path="/assumptions" component={() => <div>Assumptions</div>} />
        <Route path="/about" component={() => <div>About</div>} />

        <ControlledModal handleClose={handleClose} modalState={modalState} />
      </Container>
    </Router>
  );
}

export default App;
