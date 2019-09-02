import React, { Fragment } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  Modal, Divider, Message,
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
        { modalState.results && Object.keys(modalState.results).length
          ? (
            <Fragment>
              <ResultsGraph resultsState={modalState.results} />
              <Divider horizontal>
                It will take
                {' '}
                {getYears(modalState.results)}
                {' '}
                years
              </Divider>
              <ResultsGraph resultsState={modalState.results} />
            </Fragment>
          )
          : (
            <Message info>
              <Message.Header>Oops!</Message.Header>
              <p>{ modalState.message }</p>
            </Message>
          )
        }

      </Modal.Content>
    </Modal>
  );
};

export default ControlledModal;
