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
  Popup,
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

  h4 > button {
    float: right;
    padding: 0.5em !important;
    margin-right: 10px !important;
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

  > small {
    margin-left: 10px;
    display: inline-block;
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
        <h4>
          Unfunded Liability: March 2019
          {' '}
          <StyledRightLabel>$26.6 B</StyledRightLabel>

        </h4>
        <small>
          The Unfunded Accrued Liability (UAL) is the difference between promised retirement benefits and the amount that was invested and saved. The current UAL of $26.6B represents ~27% of the total amount needed to make good on promises to retirees. The Oregon Treasurer&rsquo;s office manages the other 73% (about $73.4B) in a mixture of stocks, bonds and other investments. This year Oregon governments &ndash;&ndash; from schools to cities, counties, fire departments and community colleges &ndash;- will invest more than $2B into that savings fund as part of a plan to fully fund the system over the next 20 years.
          <br />
          <br />
          The problem? That $2B comes out of critical current services like teachers, mental health care, bridge maintenance and public safety. And it is growing faster than more local areas&rsquo; tax base.
        </small>
      </Row>
      <Row>
        <StyledLabel htmlFor="question">
          <h4>Method:</h4>
          <small>Over what period of time should we invest in the PERS Fund? What percent of their budgets should schools, cities, counties and community colleges be expected to pay into the PERS Fund every month? Should we be setting aside more money now to invest in the PERS Fund more quickly?  Use the three buttons below to explore these options. </small>
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
              <h4>
                Years:
                <Popup
                  trigger={<Button type="button" size="mini" icon="help" />}
                  position="left center"
                  wide
                  basic
                >
                  <Popup.Content>
                    <small>The period of time over which the obligation is funded is called Amortization. Extending the time period provides near-term economic relief for local governments with lower monthly payments, but it increases the total amount that oregon will pay in the long run.  In 2019, the legislature extended the amortization period to 22 years to require lower payments from local employers over the next several years.</small>
                    <br />
                    <br />
                    <small><strong className="green">Make the amortization pay-down timeline faster or slower to see how it changes the payment plan.</strong></small>
                  </Popup.Content>
                </Popup>
              </h4>

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
                <Popup
                  trigger={<Button type="button" size="mini" icon="help" />}
                  position="left center"
                  wide
                  basic
                >
                  <Popup.Content>
                    <small>Every Oregon public employer (such as a schools, fire department, public health center or community college)  pays a different monthly amount based on their total payroll. The average contribution rate is projected to be 10% of payroll when employers cover only the costs of current benefits –– not past obligations.  However, past obligations represent a significant burden today. In 2020 the majority of public employers will pay more than 24% of payroll and some will pay more than 35%. These rates are expected to increase over the next several years.</small>
                    <br />
                    <br />
                    <small><strong className="green">Play around with contribution levels to see how they affect the payment schedule. </strong></small>
                  </Popup.Content>
                </Popup>
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
              <h4>
                Pay:
                <Popup
                  trigger={<Button type="button" size="mini" icon="help" />}
                  position="left center"
                  wide
                  basic
                >
                  <Popup.Content>
                    <small>The only real “solution” to Oregon’s unfunded liability is to pay for it. Statewide, across all levels of government, combined investments in PERS benefits and payments for the unfunded liability totaled more than $2B in 2019. Directing new money to pay down the liability more quickly has two benefits –- it reduces the longterm cost and it lowers monthly payments required of schools and other local governments. However, doing so is complex. 30% of the obligation is held by the state, 30% by schools, and 40% by cities, counties and special service districts. Each of these has a different tax base. Direct funding could be a result of new revenue through a tax, or of redirecting funding from existing programs. The kinds of taxes that could deliver revenue at this level could be property taxes, a sales tax, or an additional corporate tax. In 2019, Oregon passed a $1B corporate tax to fund schools.</small>
                    <br />
                    <br />
                    <small><strong className="green">Use these options to see how different lump sum investments change the math for Oregon’s liability.</strong></small>
                  </Popup.Content>
                </Popup>
              </h4>
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
        <StyledLabel htmlFor="RR">
          <h4>
            Rate of Return:
            <Popup
              trigger={<Button type="button" size="mini" icon="help" />}
              position="top right"
              wide
              basic
            >
              <Popup.Content>
                <small>
                  The State uses a formula to determine how much public employers need to contribute to the PERS Fund every month, based in part on a key assumption: How much will investments of those funds return on average? The current formula is based on the assumption that investments will return 7.2% annually.
                  <br />
                  <br />
                  Where does this number come from? The PERS Board makes this decision with input from a variety of sources, including the actuarial group, Milliman. According the Milliman’s modeling, an average return of 7.2% over the next couple decades is possible but is not the most likely scenario. According to their estimates lower returns on investment are more likely.
                  <br />
                  <br />
                  Why would the state choose a rate of return that is higher than the actuary’s modeled projection? There may be many reasons. However, one part of the equation is that lower returns on investments must be balanced by higher monthly payments from local governments. Otherwise the UAL will increase dramatically. If the PERS Board sets the expected return rate lower, they must also set the monthly payment rate higher.
                </small>
                <br />
                <br />
                <small><strong className="green">You can use these options to visualize how different rates of return might impact Oregon’s required payments over time. </strong></small>
              </Popup.Content>
            </Popup>
          </h4>
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
              <small>The legislature has discussed but has not acted on the idea of setting aside, or “sequestering” some part of the UAL that is currently the responsibility of local governments. Through an inter-governmental agreement, the state could agree to take this portion of the obligations, which would provide immediate and direct relief to struggling local public employers. The sequestered obligation could be financed differently than the remaining local obligations –– for instance, legislators could set the amortization period shorter or longer, or could set earnings expectations higher or lower without impacting the payment plans for local entities. This concept would result in a larger obligation for the state itself, and would require identifying a source of funding. Use this slider to set aside some portion of the UAL owed by local governments.
<br/><br/>
What is a meaningful choice? There might be several rational approaches to picking a portion of the UAL to sequester. As an example, the amount needed to set aside to reduce employer contributions to about 15% of payroll average is $15B. Or, the part of the UAL that is attributable to the market crash of the Great Recession is about $14B. The UAL that is attributable to people who are already retired or inactive employees is about $21B. </small>
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
