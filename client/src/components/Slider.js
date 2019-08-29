import React from 'react';
import {
  Form,
} from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

const SliderField = ({
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  color,
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
      <Slider
        label={value}
        onBlur={onBlur}
        onDrop={onDrop}
        onFocus={onFocus}
        value={value || defaultValue}
        name={name}
        settings={settings}
        style={{ trackFill: { backgroundColor: color } }}
      />
    </Form.Field>
  );
};

export default SliderField;
