import React from 'react';
import { VictoryBar, VictoryStack, createContainer } from 'victory';


const VictoryZoomVoronoiContainer = createContainer('voronoi');

const createStackLabels = (data) => {
  switch (true) {
    case !!data.ual:
      return `${data.year}: ual: ${Math.round(data.ual, 2)}`;
    case !!data.payment:
      return `${data.year}: payment: ${data.payment}`;
    case !!data.normal_cost:
      return `${data.year}: normal_cost: ${data.normal_cost}`;
    case !!data.pob:
      return `${data.year}: pob: ${data.pob}`;
    default:
      return `${data.year}`;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const ResultsGraph = ({
  resultsState: {
    normalCostArray,
    payArray,
    pobArray,
    ualArray,
  },
}) => (
  <VictoryStack
    labels={datum => datum.title}
    colorScale={['#9bb645', '#52c2c8', '#AAAAAA', '#AF519C']}
    containerComponent={(
      <VictoryZoomVoronoiContainer
        labels={createStackLabels}
      />
      )}
  >
    <VictoryBar
      x="year"
      y="pob"
      data={pobArray}
      style={{
        data: {
          fill: '#52c2c8',
          fillOpacity: 0.8,
        },
      }}
    />

    <VictoryBar
      x="year"
      y="normal_cost"
      data={normalCostArray}
      style={{
        data: {
          fill: '#9bb645',
          fillOpacity: 0.8,
        },
      }}
    />

    <VictoryBar
      x="year"
      y="payment"
      data={payArray}
      style={{
        data: {
          fill: '#9bb645',
          fillOpacity: 0.4,
        },
      }}
    />
    <VictoryBar
      x="year"
      y="ual"
      data={ualArray}
      style={{
        data: {
          fill: '#52c2c8',
          fillOpacity: 0.4,
        },
      }}
    />
  </VictoryStack>
);
