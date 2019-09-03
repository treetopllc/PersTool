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

import Form from './components/Form';
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
      <Menu.Item as={NavLink} name="windfall" to="/windfall">
        WINDFALL
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);


function App() {
  // eslint-disable-next-line no-unused-vars
  const [_, setData] = useState([]); // move to redux?
  const [modalState, setState] = useState({ modalOpen: false });

  const handleOpen = (results, message) => setState({ modalOpen: true, results, message });

  const handleClose = () => setState({ modalOpen: false });

  axios.defaults.headers.common.Authorization = 'dev';
  const handleSubmit = values => axios.post('/api', { data: values }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
    .then((response) => {
      let message = '';
      if (response.data) {
        const payArray = [];
        const normalCostArray = [];
        const ualArray = [];
        response.data.forEach(({
          // eslint-disable-next-line camelcase
          normal_cost, ual, payment, year,
        }) => {
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
            paid: ual <= 0,
          });
        });


        const results = {
          payArray,
          normalCostArray,
          ualArray,
        };

        setData(results);
        handleOpen(results, message);
      } else {
        if (values.question === 1) {
          message = 'The solution that you are attempting does not pay down the unfunded liability within the constitutionally mandated period of 40 years.';
        } else if (values.question === 2) {
          message = 'The solution that you are attempting does not pay down the unfunded liability within the constitutionally mandated period of 40 years. Try entering a higher contribution rate or changing the rate of return on PERS investments. But remember: investment returns are subject to market uncertainty and cannot be guaranteed, and employer contribution rates set too high could strain local economies. Most employers can manage a 15% - 18% contribution rate comfortably.';
        } else {
          message = 'The solution that you are attempting does not pay down the unfunded liability within the constitutionally mandated period of 40 years. Try entering a higher amount to fund PERS or changing the rate of return on PERS investments. But remember: investment returns are subject to market uncertainty and cannot be guaranteed, and setting an annual funding amount that is too high could strain local economies.';
        }
        handleOpen({}, message);
      }
    })
    .catch((error) => {
      throw error;
    });


  return (
    <Router>
      <GlobalStyle />
      <Container style={{ margin: 20 }}>
        <h1>PERS Tool</h1>

        <Navigation />

        <Route path="/" exact component={() => <div>Profile</div>} />
        <Route path="/calculator" component={() => <Form onSubmit={handleSubmit} />} />
        <Route path="/assumptions" component={() => <div>Assumptions</div>} />
        <Route path="/about" component={() => <div>About</div>} />
        <Route path="/windfall" component={() => <div>Windfall</div>} />

        <ControlledModal handleClose={handleClose} modalState={modalState} />
      </Container>
    </Router>
  );
}

export default App;
