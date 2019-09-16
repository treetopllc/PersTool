import React from 'react';
import {
  Divider,
} from 'semantic-ui-react';

import ResultsGraph from './Graph';

import { currentState as scenarioOneState } from '../data/windfall_1';
import { currentState as scenarioTwoState } from '../data/windfall_2';


const getYears = (results) => {
  const resultObject = results && results.ualArray.find(res => res.paid);
  if (resultObject) {
    const { year } = resultObject;
    return year - 2020;
  }
  return 'over 40';
};

export default function Windfall() {
  return (
    <div>
      <ResultsGraph resultsState={scenarioOneState} />
      <Divider horizontal>
        Scenario One will take
        {' '}
        {getYears(scenarioOneState)}
        {' '}
        years.
        <br />
        Scenario Two will take
        {' '}
        {getYears(scenarioTwoState)}
        {' '}
        years
      </Divider>
      <ResultsGraph resultsState={scenarioTwoState} />
    </div>
  );
}
