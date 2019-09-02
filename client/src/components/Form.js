import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  formValueSelector,
  propTypes,
} from 'redux-form';
import {
  Button,
  Form,
  Label,
} from 'semantic-ui-react';
import {
  number,
} from 'prop-types';
import styled from 'styled-components';

import CustomButtonInput from './Button';
import SliderField from './Slider';


const StyledLabel = styled.label`
  width: 100%;
  font-family: 'Fjalla One', sans-serif;

  small {
    margin: 10px;
    display: inline-block;
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex: row wrap;
  justify-content: space-between;
  margin: 14px 10px;
`;

const Row = styled.div`
  margin: 20px 0;

  &:first-of-type {
    margin-top: 50px;
  }

  &:last-of-type {
    margin-bottom: 50px;
  }

`;

const StyledRightLabel = styled(Label)`
  float: right;
  margin-right: 10px !important;
  background-color: #9bb645 !important;
  color: white !important;
  font-family: 'Libre Franklin', sans-serif !important;
`;

const SubmitButton = styled(Button)`
  background-color: #52c2c8 !important;
  color: white !important;
`;

const TextButton = styled(Button)`
  margin: 0 10px;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  box-shadow: none;
  font-size: 0.85rem !important;
  color: #52c2c8 !important;
`;

const TestForm = (props) => {
  const {
    questionValue,
    contributionRateValue,
    sualValue,
    taxValue,
    handleSubmit,
    pristine,
    reset,
    submitting,
  } = props;

  const [advancedCalculator, setAdvancedCalculator] = useState(false);
  const handleSimpleCalculator = () => {
    reset();
    setAdvancedCalculator(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <StyledLabel htmlFor="question">
          <h4>Method:</h4>
          <StyledButtonGroup>
            <Field
              name="question"
              id="question"
              value="1"
              inputvalue="1"
              buttonvalue="Amortization Period"
              component={CustomButtonInput}
            />

            <Field
              name="question"
              id="question"
              value="2"
              inputvalue="2"
              buttonvalue="Employer Contribution Rate"
              component={CustomButtonInput}
            />

            <Field
              name="question"
              id="question"
              value="3"
              inputvalue="3"
              buttonvalue="Funding"
              component={CustomButtonInput}
            />
          </StyledButtonGroup>
        </StyledLabel>
      </Row>

      <Row>
        {questionValue === 1 && (
          <div>
            <StyledLabel htmlFor="amperiod">
              <h4>Years:</h4>
              <StyledButtonGroup>
                <Field
                  name="amperiod"
                  id="amperiod16"
                  value="16"
                  inputvalue="16"
                  buttonvalue="16"
                  component={CustomButtonInput}
                />

                <Field
                  name="amperiod"
                  id="amperiod22"
                  value="22"
                  inputvalue="22"
                  buttonvalue="22"
                  component={CustomButtonInput}
                />

                <Field
                  name="amperiod"
                  id="amperiod26"
                  value="26"
                  inputvalue="26"
                  buttonvalue="26"
                  component={CustomButtonInput}
                />
                <Field
                  name="amperiod"
                  id="amperiod30"
                  value="30"
                  inputvalue="30"
                  buttonvalue="30"
                  component={CustomButtonInput}
                />
              </StyledButtonGroup>
            </StyledLabel>
          </div>
        )}
        {questionValue === 2 && (
          <div>
            <StyledLabel htmlFor="contribution_rate">
              <h4>
                Contribution Rate:
                <StyledRightLabel>
                  { Math.round(contributionRateValue * 100) }
                  %
                </StyledRightLabel>
              </h4>

              <Field
                name="contribution_rate"
                id="contribution_rate"
                placeholder="Contribution Rate"
                multiple
                min={0.10}
                max={0.35}
                defaultValue={0.15}
                step={0.01}
                color="#9bb645"
                label="Contribution Rate"
                component={SliderField}
              />
              <small>
                We expect that the total contribution rate will be
                {' '}
                <strong className="green">10%</strong>
                {' '}
                of payroll or less once the PERS investment fund is fully funded. We estimate that a PERS contribution rate of
                {' '}
                <strong className="green">15%</strong>
                {' '}
                to
                {' '}
                <strong className="green">18%</strong>
                {' '}
                is manageable for most public employers.
              </small>
            </StyledLabel>
          </div>
        )}
        {questionValue === 3 && (
          <div>
            <StyledLabel htmlFor="pay">
              <h4>Pay:</h4>
              <StyledButtonGroup>
                <Field
                  name="pay"
                  id="pay"
                  value="2000"
                  inputvalue="2000"
                  buttonvalue="$2 B"
                  component={CustomButtonInput}
                />
                <Field
                  name="pay"
                  id="pay"
                  value="2500"
                  inputvalue="2500"
                  buttonvalue="$2.5 B"
                  component={CustomButtonInput}
                />
                <Field
                  name="pay"
                  id="pay"
                  value="3000"
                  inputvalue="3000"
                  buttonvalue="$3 B"
                  component={CustomButtonInput}
                />
                <Field
                  name="pay"
                  id="pay"
                  value="3500"
                  inputvalue="3500"
                  buttonvalue="$3.5 B"
                  component={CustomButtonInput}
                />
                <Field
                  name="pay"
                  id="pay"
                  value="4000"
                  inputvalue="4000"
                  buttonvalue="$4 B"
                  component={CustomButtonInput}
                />
              </StyledButtonGroup>
            </StyledLabel>
          </div>
        )}
      </Row>

      <Row>
        <h4>
          Unfunded Liability:
          {' '}
          <StyledRightLabel>$26.6 B</StyledRightLabel>
        </h4>
      </Row>

      <Row>
        <StyledLabel htmlFor="RR">
          <h4>Rate of Return:</h4>
          <StyledButtonGroup>
            <Field
              name="RR"
              id="RR"
              value="1.05"
              inputvalue="1.05"
              buttonvalue="5.0%"
              component={CustomButtonInput}
            />

            <Field
              name="RR"
              id="RR"
              value="1.067"
              inputvalue="1.067"
              buttonvalue="6.7%"
              component={CustomButtonInput}
            />

            <Field
              name="RR"
              id="RR"
              value="1.072"
              inputvalue="1.072"
              buttonvalue="7.2%"
              component={CustomButtonInput}
            />

            <Field
              name="RR"
              id="RR"
              value="1.09"
              inputvalue="1.09"
              buttonvalue="9.0%"
              component={CustomButtonInput}
            />
          </StyledButtonGroup>
        </StyledLabel>
      </Row>

      <Row>
        {advancedCalculator ? <TextButton type="button" float="right" onClick={handleSimpleCalculator}>Simple Calculator</TextButton> : <TextButton type="button" float="right" onClick={() => setAdvancedCalculator(true)}>Advanced Calculator</TextButton>}

      </Row>

      { advancedCalculator
        && (
        <Fragment>
          <Row>
            <StyledLabel htmlFor="tax">
              Directed Funding for Sequestered Liability
              <StyledRightLabel>{taxValue}</StyledRightLabel>
              <Field
                name="tax"
                id="tax"
                placeholder="Tax Per Year"
                min={0}
                max={2}
                defaultValue={0}
                step={0.01}
                color="#9bb645"
                label="Tax Per Year"
                component={SliderField}
              />
              <small>
                Directing revenue to fund this challenge is complex.
                {' '}
                <strong className="green">30% </strong>
                of the obligation is held by the state,
                {' '}
                <strong className="green">30% </strong>
                by schools, and
                {' '}
                <strong className="green">40% </strong>
                {' '}
                by cities, counties and special service districts. Each of these has a different tax base. Direct funding could be a result of taking funding away from existing programs or new revenue through a tax. The kinds of taxes that could deliver revenue at this level could be property taxes, a sales tax, or an additional corporate tax. In 2019, Oregon passed a $1B corporate tax to fund schools.
              </small>
            </StyledLabel>
          </Row>

          <Row>
            <StyledLabel htmlFor="sual">
              <h4>
                Sequestered Liability:
                <StyledRightLabel>
                  { sualValue }
                </StyledRightLabel>
              </h4>

              <Field
                name="sual"
                id="sual"
                placeholder="SUAL"
                min={0}
                max={50}
                defaultValue={0}
                color="#9bb645"
                label="Sequestered Liability"
                component={SliderField}
              />
            </StyledLabel>
          </Row>
        </Fragment>
        )
      }

      <div>
        <SubmitButton type="submit" disabled={submitting}>
          Submit
        </SubmitButton>
        <Button type="button" disabled={pristine || submitting} onClick={reset}>
          Reset Values
        </Button>
      </div>
    </Form>
  );
};

TestForm.propTypes = {
  ...propTypes,
  questionValue: number,
};

TestForm.defaultProps = {
  questionValue: 1,
};

const TestFormContainer = reduxForm({
  form: 'pers', // a unique name for the form
  keepDirtyOnReinitialize: true,
  enableReinitialize: true,
  destroyOnUnmount: false,
  initialValues: {
    question: 1,
    amperiod: 16,
    contribution_rate: 0.15,
    pay: 2000,
    ual: 26600,
    sual: 0,
    RR: 1.05,
    inflation: 1.03,
    tax: 0,
  },
})(TestForm);

// Decorate with connect to read form values
const selector = formValueSelector('pers'); // <-- same as form name
const ConnectedTestForm = connect((state) => {
  const questionValue = selector(state, 'question');
  const amperiodValue = selector(state, 'amperiod');
  const contributionRateValue = selector(state, 'contribution_rate');
  const sualValue = selector(state, 'sual');
  const taxValue = selector(state, 'tax');

  return {
    questionValue, // available as props on the form
    amperiodValue,
    contributionRateValue,
    sualValue,
    taxValue,
  };
})(TestFormContainer);

export default ConnectedTestForm;

/* TODO:
  - register defaultValues as initialValues
  - update propTypes
  - (API) error handling and validation
  - (FE) error handling and validation
  - move styles into their own file
  - move hooks to redux
  */
