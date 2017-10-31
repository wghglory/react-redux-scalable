/**
*
* Navigation
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

function Navigation({ topics, selectTopic }) {
  return (
    <div className={styles.navigation}>
      {topics.map((t) => (
        <div key={t.name} onClick={() => selectTopic(t)}>
          {t.name}
        </div>
      ))}
    </div>
  );
}

Navigation.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  selectTopic: PropTypes.func.isRequired
};

export default Navigation;
