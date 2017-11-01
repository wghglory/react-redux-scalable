/**
*
* Drawer
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import classNames from 'classnames';

function Drawer({ items, selectItem, itemLabelAttr, itemKeyAttr, isDrawerOpen }) {
  return (
    <div className={classNames(styles.drawer, { [styles.drawerOpen]: isDrawerOpen })}>
      {items.map((i) => (
        <div className={styles.item} key={i[itemKeyAttr]} onClick={selectItem.bind(null, i)}>
          {i[itemLabelAttr]}
        </div>
      ))}
    </div>
  );
}

Drawer.propTypes = {
  items: PropTypes.array.isRequired,
  selectItem: PropTypes.func.isRequired,
  itemLabelAttr: PropTypes.string.isRequired,
  itemKeyAttr: PropTypes.string.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired
};

export default Drawer;
