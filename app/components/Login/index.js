/**
*
* Login
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import validator from 'email-validator';
import classNames from 'classnames';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: ''
    };
  }

  login = () => {
    const email = this.emailField.value;
    if (!validator.validate(email)) {
      this.setState({
        errorText: 'Please provide a valid email'
      });
      return;
    }

    this.setState({
      errorText: null
    });

    this.props.login(email);
  };
  render() {
    return (
      <div className={styles.login}>
        <div className={styles.heading}>Login with your email</div>

        <input
          className={classNames(styles.input, { [styles.inputError]: this.state.errorText })}
          placeholder="Your email"
          ref={(f) => {
            this.emailField = f;
          }}
          type="text"
        />

        {this.state.errorText ? <div className={styles.errorMessage}>{this.state.errorText}</div> : null}

        <div className={styles.actionContainer}>
          <div className={styles.button} onClick={this.props.cancelLogin}>
            cancel
          </div>
          <div className={styles.button} onClick={this.login}>
            log in
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  cancelLogin: PropTypes.func.isRequired
};

export default Login;
