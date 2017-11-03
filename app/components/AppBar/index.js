/**
*
* AppBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import IconButton from '../IconButton/index';
import { Link } from 'react-router';

// 登陆成功后显示 登陆邮箱
function AppBar({ toggleDrawer, email }) {
  return (
    <div className={styles.appBar}>
      <IconButton icon="bars" buttonClass={styles.iconButton} iconClass={styles.icon} onClick={toggleDrawer} />
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
