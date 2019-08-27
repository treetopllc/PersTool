import React from 'react';
import {
  Button,
} from 'semantic-ui-react';
import styled from 'styled-components';


const StyledButton = styled(Button)`
  flex: 0 1 200px;

  &.ui.active.button {
    background-color: #9bb645;
    color: white;
  }
`;

const CustomButtonInput = ({
  input: { onChange, value },
  inputvalue,
  buttonvalue,
}) => (
  <StyledButton active={value === parseInt(inputvalue, 10)} type="button" value={inputvalue} onClick={e => onChange(parseInt(e.target.value, 10))}>
    {buttonvalue}
  </StyledButton>
);

export default CustomButtonInput;
