
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
