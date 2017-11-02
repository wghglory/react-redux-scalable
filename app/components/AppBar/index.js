/**
*
* AppBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

// 登陆成功后显示 登陆邮箱
function AppBar({ toggleDrawer, email }) {
  return (
    <div className={styles.appBar}>
      <div className={styles.iconButton} onClick={toggleDrawer}>
        <FontAwesome className={styles.icon} name="bars" />
      </div>
      <div className={styles.heading}>Coder Daily</div>
      <div className={styles.linkContainer}>{email || <Link to="/login">Login</Link>}</div>
    </div>
  );
}

AppBar.propTypes = {
  email: PropTypes.string,
  toggleDrawer: PropTypes.func.isRequired
};

export default AppBar;
