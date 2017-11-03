/**
*
* LinkForm
*
*/

import React from 'react';

import styles from './styles.css';
import TextInput from '../TextInput/index';

class LinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: ''
    };
  }

  render() {
    return (
      <div className={styles.overlay}>
        <div className={styles.linkForm}>
          <div className={styles.heading}>Add a link</div>
          <TextInput placeholder="URL" className={styles.input} />
          <TextInput placeholder="Description" className={styles.input} />
          <div className={styles.actionContainer}>
            <div className={styles.button}>cancel</div>
            <div className={styles.button}>log in</div>
          </div>
        </div>
      </div>
    );
  }
}

export default LinkForm;
