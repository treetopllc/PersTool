import React from 'react';
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
import { numericality } from 'redux-form-validators';
import styled from 'styled-components';


const StyledFieldWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const StyledLabel = styled.label`
  width: 100%;
  margin: 10px;
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
}) => {
  // const [inputValue, setValue] = useState(5);
  const settings = {
    value,
    min: 0,
    max: 100,
    step: 1,
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
      <Input placeholder="Enter Value" onChange={handleValueChange} />
      <StyledLabel color="red">
        {value}
        <Slider
          onBlur={onBlur}
          onDrop={onDrop}
          onFocus={onFocus}
          value={value}
          color="red"
          settings={settings}
        />
      </StyledLabel>
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
      <StyledLabel htmlFor="test">
        test
        <Field
          name="test"
          id="test"
          placeholder="Test"
          options={options}
          component={SliderField}
        />
      </StyledLabel>
      <StyledLabel htmlFor="question">
        Type
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
        Years
            <Field
              name="amperiod"
              id="amperiod"
              component={InputField}
              type="number"
              placeholder="Years"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </div>
      )}
      {questionValue === 2 && (
        <div>
          <StyledLabel htmlFor="contribution_rate">
        Contribution Rate
            <Field
              name="contribution_rate"
              id="contribution_rate"
              component={InputField}
              type="number"
              placeholder="Contribution Rate"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </div>
      )}
      {questionValue === 3 && (
        <div>
          <StyledLabel htmlFor="pay">
          Pay
            <Field
              name="pay"
              id="pay"
              component={InputField}
              type="number"
              placeholder="Pay"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
              validate={numericality({ '>': 720.881725 })}
            />
          </StyledLabel>
        </div>
      )}

      <Form.Group>
        <StyledFieldWrapper>
          <StyledLabel htmlFor="ual">
          Unfunded Accrued Liability
            <Field
              name="ual"
              id="ual"
              component={InputField}
              type="number"
              placeholder="UAL"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </StyledFieldWrapper>
        <StyledFieldWrapper>
          <StyledLabel htmlFor="sual">
          Sequestered UAL
            <Field
              style={{ display: 'flex' }}
              name="sual"
              id="sual"
              component={InputField}
              type="number"
              placeholder="Sequestered UAL"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </StyledFieldWrapper>
      </Form.Group>
      <Form.Group>
        <StyledFieldWrapper>
          <StyledLabel htmlFor="RR">
          Inflation Adjusted Rate of Return
            <Field
              name="RR"
              id="RR"
              component={InputField}
              type="number"
              placeholder="Rate of Return"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </StyledFieldWrapper>
        <StyledFieldWrapper>
          <StyledLabel htmlFor="inflation">
          Inflation Rate
            <Field
              name="inflation"
              id="inflation"
              component={InputField}
              type="number"
              placeholder="Inflation Rate"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </StyledFieldWrapper>
        <StyledFieldWrapper>
          <StyledLabel htmlFor="tax">
          Tax Per Year
            <Field
              name="tax"
              id="tax"
              component={InputField}
              type="number"
              placeholder="Tax Per Year"
              parse={val => (Number.isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
            />
          </StyledLabel>
        </StyledFieldWrapper>
      </Form.Group>

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
  questionValue: 0,
};

const TestFormContainer = reduxForm({
  // a unique name for the form
  form: 'test',
})(TestForm);

// Decorate with connect to read form values
const selector = formValueSelector('test'); // <-- same as form name
const ConnectedTestForm = connect((state) => {
  const questionValue = selector(state, 'question');
  // or together as a group
  const { firstName, lastName } = selector(state, 'firstName', 'lastName');
  return {
    questionValue,
    fullName: `${firstName || ''} ${lastName || ''}`,
  };
})(TestFormContainer);

export default ConnectedTestForm;
