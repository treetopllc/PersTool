import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  Modal, Divider,
} from 'semantic-ui-react';

import { ResultsGraph } from './Graph';

const ControlledModal = ({
  handleClose, modalState,
}) => (
  <Modal
    open={modalState.modalOpen}
    onClose={handleClose}
    closeIcon
    size="tiny"
  >
    <Modal.Content>
      <ResultsGraph resultsState={modalState.results} />
      <Divider horizontal>Or</Divider>
      <ResultsGraph resultsState={modalState.results} />
    </Modal.Content>
  </Modal>
);

export default ControlledModal;
