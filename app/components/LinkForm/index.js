/**
*
* LinkForm
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import TextInput from '../TextInput/index';

class LinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      urlError: '',
      descriptionError: ''
    };
  }

  onAdd = () => {
    const url = this.url.getValue();
    const description = this.description.getValue();
    let urlError = null;
    let descriptionError = null;

    if (!url.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
      urlError = 'Please provide a valid URL';
    }

    if (!description) {
      descriptionError = 'Please provide a valid description';
    }

    this.setState({
      urlError,
      descriptionError
    });

    if (urlError || descriptionError) {
      return;
    }

    this.props.addLink({
      url,
      description,
      topicName: this.props.topicName
    });
  };

  render() {
    return (
      <div className={styles.overlay}>
        <div className={styles.linkForm}>
          <div className={styles.heading}>Add a link</div>
          <TextInput
            placeholder="URL"
            className={styles.input}
            errorText={this.state.urlError}
            ref={(ele) => (this.url = ele)}
          />
          <TextInput
            placeholder="Description"
            className={styles.input}
            errorText={this.state.descriptionError}
            ref={(ele) => (this.description = ele)}
          />
          <div className={styles.actionContainer}>
            <div className={styles.button} onClick={this.props.addLinkCancelled}>
              Cancel
            </div>
            <div className={styles.button} onClick={this.onAdd}>
              Add
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LinkForm.propTypes = {
  addLink: PropTypes.func.isRequired,
  topicName: PropTypes.string.isRequired,
  addLinkCancelled: PropTypes.func.isRequired
};

export default LinkForm;
