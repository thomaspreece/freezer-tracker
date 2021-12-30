import React from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from 'react-transition-group';

import './ComplexListItem.css';

const ComplexListItem = ({ count, name, image, added }) => (
  <div className="complex-swipeable-list__item">
    <div className="complex-swipeable-list__item-image-container">
      <div className="complex-swipeable-list__item-image-margin"></div>
      <img className="complex-swipeable-list__item-image" alt="item preview" src={image} />
      <div className="complex-swipeable-list__item-image-margin"></div>
    </div>
    <div className="complex-swipeable-list__item-label">
      <span className="complex-swipeable-list__item-name">
        <span>{name}</span>
      </span>
      <span className="complex-swipeable-list__item-added">{added}</span>
    </div>

    <div className="complex-swipeable-list__item-count-container">
      <CSSTransition key={count} timeout={200} appear={true} in={true} classNames="listitemcount">
        <div key={count} className="complex-swipeable-list__item-count">{count}</div>
      </CSSTransition>
    </div>
  </div>
);

ComplexListItem.propTypes = {
  count: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  added: PropTypes.string,
};

export default ComplexListItem;
