import React from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from 'react-transition-group';

const ComplexListItemCount = ({ count }) => (
  <CSSTransition key={count} timeout={200} appear={true} in={true} classNames="listitemcount">
    <div className="complex-swipeable-list__item-count">{count}</div>
  </CSSTransition>
);

ComplexListItemCount.propTypes = {
  count: PropTypes.number,
};

export default ComplexListItemCount;
