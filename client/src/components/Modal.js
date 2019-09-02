import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  Modal, Divider,
} from 'semantic-ui-react';

import { ResultsGraph } from './Graph';

const ControlledModal = ({
  handleClose, modalState,
}) => {
  const getYears = (results) => {
    const resultObject = results && results.ualArray.find(res => res.paid);
    if (resultObject) {
      const { year } = resultObject;
      return year - 2020;
    }
    return 'over 40';
  };

  return (
    <Modal
      open={modalState.modalOpen}
      onClose={handleClose}
      closeIcon
      size="small"
    >
      <Modal.Content>
        <ResultsGraph resultsState={modalState.results} />
        <Divider horizontal>
          It will take
          {' '}
          {getYears(modalState.results)}
          {' '}
          years
        </Divider>
        <ResultsGraph resultsState={modalState.results} />
      </Modal.Content>
    </Modal>
  );
};

export default ControlledModal;
