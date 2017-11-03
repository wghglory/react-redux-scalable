/**
*
* IconButton
*
*/

import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.css';

function IconButton({ onClick, icon, iconClass, buttonClass }) {
  return (
    <div className={classNames(styles.iconButton, buttonClass)} onClick={onClick}>
      <FontAwesome className={iconClass} name={icon} />
    </div>
  );
}

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
  buttonClass: PropTypes.string
};

export default IconButton;
