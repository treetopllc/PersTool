import React from 'react';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  formValueSelector,
  propTypes,
} from 'redux-form';
import {
  Container,
  Grid,
  Button,
  Form,
  Input,
  Select,
} from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import {
  func,
  number,
  string,
  bool,
  oneOfType,
  shape,
  arrayOf,
  object,
} from 'prop-types';
import styled from 'styled-components';


const StyledLabel = styled.label`
  width: 100%;
  font-family: 'Fjalla One', sans-serif;
`;

const InputField = ({
  placeholder,
  label,
  type,
  fluid,
  input: {
    onBlur,
    onDrop,
    onFocus,
    name,
    onChange,
    value,
  },
  id = name,
  ...rest
}) => (
  <Form.Field>
    <Input
      onBlur={onBlur}
      onDrop={onDrop}
      onFocus={onFocus}
      name={name}
      value={value}
      onChange={(param, data) => onChange(data.value)}
      label={label}
      placeholder={placeholder}
      id={id || name}
      type={type}
      fluid={fluid}
      {...rest}
    />
  </Form.Field>
);

InputField.propTypes = {
  input: shape({
    onBlur: func.isRequired,
    onChange: func.isRequired,
    onFocus: func.isRequired,
    onDrop: func,
    name: string.isRequired,
    value: oneOfType([string, number]),
  }).isRequired,
  id: string,
  type: string.isRequired,
  label: string,
  placeholder: string,
  fluid: bool,
};

InputField.defaultProps = {
  id: 'textinput',
  label: null,
  placeholder: '',
  fluid: false,
};

const SliderField = ({
  label = "",
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  input: {
    onBlur,
    onDrop,
    onFocus,
    name,
    onChange,
    value,
  },
}) => {
  // const [inputValue, setValue] = useState(5);
  const settings = {
    start: defaultValue,
    min,
    max,
    step,
    onChange,
  };

  const handleValueChange = (e) => {
    let inputValue = parseInt(e.target.value, 10);
    if (!inputValue) {
      inputValue = 0;
    }
    onChange(e.target.value);
  };

  return (
    <Form.Field>
      <StyledLabel>
        {value}
        {label}

      </StyledLabel>
      <Slider
        onBlur={onBlur}
        onDrop={onDrop}
        onFocus={onFocus}
        value={value}
        name={name}
        settings={settings}
        style={{ trackFill: { backgroundColor: '#AF519C' } }}
      />
    </Form.Field>
  );
};


const SelectField = ({
  id,
  placeholder,
  options,
  fluid,
  input: {
    onBlur,
    onDrop,
    onFocus,
    name,
    onChange,
    value,
  },
}) => (
  <Form.Field>
    <Select
      onBlur={onBlur}
      onDrop={onDrop}
      onFocus={onFocus}
      name={name}
      value={value}
      onChange={(param, data) => onChange(data.value)}
      placeholder={placeholder}
      options={options}
      id={id || name}
      fluid={fluid}
    />
  </Form.Field>
);

SelectField.propTypes = {
  input: shape({
    onBlur: func.isRequired,
    onChange: func.isRequired,
    onFocus: func.isRequired,
    onDrop: func,
    name: string.isRequired,
    value: oneOfType([string, number]),
  }).isRequired,
  id: string,
  options: arrayOf(object).isRequired,
  placeholder: string,
  fluid: bool,
};

SelectField.defaultProps = {
  id: 'textinput',
  placeholder: '',
  fluid: false,
};

const TestForm = (props) => {
  const {
    questionValue = '',
    handleSubmit,
    pristine,
    reset,
    submitting,
  } = props;

  const options = [
    { key: '1', text: 'Amortization period (1)', value: 1 },
    { key: '2', text: 'Contribution rate (2)', value: 2 },
    { key: '3', text: 'Annual pay (3)', value: 3 },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <StyledLabel htmlFor="question">
        Text for Question
        <br />
        <small>Explanatory text for Question. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi tincidunt ornare massa eget egestas purus.  </small>
        <Field
          name="question"
          id="question"
          placeholder="Question"
          options={options}
          component={SelectField}
        />
      </StyledLabel>
      {questionValue === 1 && (
        <div>
          <StyledLabel htmlFor="amperiod">
            <Field
              name="amperiod"
              id="amperiod"
              placeholder="Years"
              min={1}
              max={50}
              defaultValue={20}
              label=" Years"
              component={SliderField}
            />
          </StyledLabel>
        </div>
      )}
      {questionValue === 2 && (
        <div>
          <StyledLabel htmlFor="contribution_rate">
            <Field
              name="contribution_rate"
              id="contribution_rate"
              placeholder="Contribution Rate"
              min={1}
              max={50}
              defaultValue={20}
              label="Contribution Rate"
              component={SliderField}
            />
          </StyledLabel>
        </div>
      )}
      {questionValue === 3 && (
        <div>
          <StyledLabel htmlFor="pay">
            <Field
              name="pay"
              id="pay"
              placeholder="Pay"
              min={1}
              max={50}
              defaultValue={20}
              label="Pay"
              component={SliderField}
            />
          </StyledLabel>
        </div>
      )}

      <StyledLabel htmlFor="ual">
        <Field
          name="ual"
          id="ual"
          placeholder="UAL"
          min={10000}
          max={40000}
          defaultValue={26600}
          label="Unfunded Accrued Liability"
          component={SliderField}
        />
      </StyledLabel>
      <StyledLabel htmlFor="sual">
        <Field
          name="sual"
          id="sual"
          placeholder="SUAL"
          min={0}
          max={50}
          defaultValue={0}
          label="Sequestered Unfunded Accrued Liability"
          component={SliderField}
        />
      </StyledLabel>
      <StyledLabel htmlFor="RR">
        <Field
          name="RR"
          id="RR"
          placeholder="Rate of Return"
          min={1}
          max={2}
          defaultValue={1.042}
          step={0.001}
          label="Inflation Adjusted Rate of Return"
          component={SliderField}
        />
      </StyledLabel>
      <StyledLabel htmlFor="inflation">
        <Field
          name="inflation"
          id="inflation"
          placeholder="Inflation"
          min={1}
          max={2}
          defaultValue={1.03}
          step={0.01}
          label="Inflation Rate"
          component={SliderField}
        />
      </StyledLabel>
      <StyledLabel htmlFor="tax">
        <Field
          name="tax"
          id="tax"
          placeholder="Tax Per Year"
          min={0}
          max={2}
          defaultValue={0}
          step={0.01}
          label="Tax Per Year"
          component={SliderField}
        />
      </StyledLabel>

      <div>
        <Button type="submit" disabled={pristine || submitting}>
          Submit
        </Button>
        <Button type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
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
  form: 'test', // a unique name for the form
  initialValues: {
    sliderOne: 50,
    question: 1,
  },
})(TestForm);

// Decorate with connect to read form values
const selector = formValueSelector('test'); // <-- same as form name
const ConnectedTestForm = connect((state) => {
  const questionValue = selector(state, 'question');

  return {
    questionValue, // available as props on the form
  };
})(TestFormContainer);

export default ConnectedTestForm;

/* TODO:
  - register defaultValues as initialValues
  - break this file up
  - update propTypes
  - convert the select to pills/tabs
  - defaultValues for the graph
  - (API) error handling and validation
  - (FE) error handling and validation
  - move styles into their own file
  - style padding and margins
  - move hooks to redux
  */
