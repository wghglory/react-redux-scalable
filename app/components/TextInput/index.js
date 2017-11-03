/**
*
* TextInput
*
*/

import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import PropTypes from 'prop-types';

class TextInput extends React.Component {
  getValue() {
    return this.field.value;
  }
  render() {
    const { errorText } = this.props;

    return (
      <div>
        <input
          className={classNames(styles.input, this.props.className, { [styles.inputError]: errorText })}
          placeholder={this.props.placeholder}
          type="text"
          ref={(ele) => (this.field = ele)}
        />
        {errorText ? <div className={styles.errorMessage}>{errorText}</div> : null}
      </div>
    );
  }
}

TextInput.propTypes = {
  className: PropTypes.string,
  errorText: PropTypes.string,
  placeholder: PropTypes.string
};

export default TextInput;
