/**
*
* LinkList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import Link from '../Link/index';

function LinkList({ links, topicName }) {
  return (
    <div className={styles.linkList}>
      <h1 className={styles.topic}>{topicName}</h1>
      {links.map((l) => <Link key={l.id} link={l} />)}
    </div>
  );
}

LinkList.propTypes = {
  topicName: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  )
};

export default LinkList;
