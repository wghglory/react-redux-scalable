/**
*
* LinkList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import Link from '../Link/index';
import IconButton from '../IconButton/index';

function LinkList({ links, topicName, children, startAdd }) {
  return (
    <div className={styles.linkList}>
      <h1 className={styles.topic}>{topicName}</h1>
      {links.map((l) => <Link key={l.id} link={l} />)}
      <IconButton icon="plus" buttonClass={styles.button} iconClass={styles.icon} onClick={() => startAdd(topicName)} />
      {children}
    </div>
  );
}

LinkList.propTypes = {
  startAdd: PropTypes.func.isRequired,
  children: PropTypes.element,
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
