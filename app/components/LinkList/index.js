/**
*
* LinkList
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

function LinkList({ links }) {
  return (
    <div className={styles.linkList}>
      {links.map((l) => (
        <div key={l.id}>
          {l.url} - {l.description}
        </div>
      ))}
    </div>
  );
}

LinkList.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  )
};

export default LinkList;