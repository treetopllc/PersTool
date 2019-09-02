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