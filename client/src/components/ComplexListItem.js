import React from 'react';
import PropTypes from 'prop-types';

import './ComplexListItem.css';

const ComplexListItem = ({ count, name, image, added }) => (
  <div className="complex-swipeable-list__item">
    <div className="complex-swipeable-list__item-image-container">
      <div className="complex-swipeable-list__item-image-margin"></div>
      <img className="complex-swipeable-list__item-image" src={image} />
      <div className="complex-swipeable-list__item-image-margin"></div>
    </div>
    <div className="complex-swipeable-list__item-label">
      <span className="complex-swipeable-list__item-name">
        <span>{name}</span>
      </span>
      <span className="complex-swipeable-list__item-added">{added}</span>
    </div>

    <div className="complex-swipeable-list__item-count-container">
      <div className="complex-swipeable-list__item-count">{count}</div>
    </div>
  </div>
);

ComplexListItem.propTypes = {
  count: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  added: PropTypes.string,
};

export default ComplexListItem;
