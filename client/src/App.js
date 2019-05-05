import React, { useState } from 'react';
import axios from 'axios';
import { VictoryBar } from 'victory';
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid } from 'semantic-ui-react';

import TestForm from './components/form';

function App() {
  const [state, setData] = useState({
    pay: [],
    ual: [],
    contribution_rate: [],
    normal_cost: [],
  }); // move to redux
  const handleSubmit = (values) => {
    axios.post('http://127.0.0.1:5000/api', { data: values })
      .then((response) => {
        console.log(response);
        const payArray = response.data.map((dataset, index) => ({
          ...dataset.filter(item => item.pay)[0],
          year: index,
        }));
        const ualArray = response.data.map((dataset, index) => ({
          ...dataset.filter(item => item.ual)[0],
          year: index,
        }));
        const rateArray = response.data.map((dataset, index) => ({
          ...dataset.filter(item => item.contribution_rate)[0],
          year: index,
        }));
        const costArray = response.data.map((dataset, index) => ({
          ...dataset.filter(item => item.normal_cost)[0],
          year: index,
        }));
        console.log(payArray, ualArray);
        setData({
          pay: payArray,
          ual: ualArray,
          contribution_rate: rateArray,
          normal_cost: costArray,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(values);
  };
  return (
    <Container style={{ margin: 20 }}>
      <TestForm onSubmit={handleSubmit} />
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
          Pay:
            {state.pay.length ? <VictoryBar data={state.pay} x="year" y="pay" /> : ''}
          </Grid.Column>
          <Grid.Column width={8}>
          UAL:
            {state.ual.length ? <VictoryBar data={state.ual} x="year" y="ual" /> : ''}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
          RATE:
            {state.contribution_rate.length ? <VictoryBar data={state.contribution_rate} x="year" y="contribution_rate" /> : ''}
          </Grid.Column>
          <Grid.Column width={8}>
          COST:
            {state.normal_cost.length ? <VictoryBar data={state.normal_cost} x="year" y="normal_cost" /> : ''}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
