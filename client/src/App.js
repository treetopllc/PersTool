import React, { useState } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryStack } from 'victory';

import 'semantic-ui-css/semantic.min.css';
import { Container, Grid } from 'semantic-ui-react';
import { createGlobalStyle } from 'styled-components';
import TestForm from './components/form';


const GlobalStyle = createGlobalStyle`
  body, input, small {
    font-family: 'Libre Franklin', sans-serif !important;
  }

  h1, h2, h3, h4 {
    font-family: 'Fjalla One', sans-serif !important;
  }
`;


function App() {
  const [state, setData] = useState([]); // move to redux?
  const handleSubmit = (values) => {
    axios.post('/api', { data: values })
      .then((response) => {
        const payArray = [];
        const normalCostArray = [];
        const ualArray = [];
        const pobArray = [];
        // eslint-disable-next-line camelcase
        response.data.forEach(({ normal_cost, ual, sual, pob, payment, year }) => {
          payArray.push({
            payment,
            year,
          });

          pobArray.push({
            pob: pob || 0,
            year,
          });

          normalCostArray.push({
            normal_cost,
            year,
          });

          ualArray.push({
            ual,
            year,
          });
        });
        setData({
          payArray,
          pobArray,
          normalCostArray,
          ualArray,
        });
      })
      .catch((error) => {
        throw error;
      });
  };
  return (
    <Container style={{ margin: 20 }}>
      <GlobalStyle />
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <TestForm onSubmit={handleSubmit} />
          </Grid.Column>
          <Grid.Column width={16}>
            <VictoryStack>
              <VictoryBar
                x="year"
                y="normal_cost"
                data={state.normalCostArray}
                style={{ data: { fill: '#9bb645', fillOpacity: 0.7 } }}
              />
              <VictoryBar
                x="year"
                y="payment"
                data={state.payArray}
                style={{ data: { fill: '#AF519C', fillOpacity: 0.7 } }}
              />
              <VictoryBar
                x="year"
                y="pob"
                data={state.pobArray}
                style={{ data: { fill: '#52c2c8', fillOpacity: 0.7 } }}
              />
              <VictoryBar
                x="year"
                y="ual"
                data={state.ualArray}
                style={{ data: { fill: '#AAAAAA', fillOpacity: 0.7 } }}
              />
            </VictoryStack>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
