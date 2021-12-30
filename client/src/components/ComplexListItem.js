import React from 'react';
import PropTypes from 'prop-types';

import ComplexListItemCount from './ComplexListItemCount'

import './ComplexListItem.css';

const ComplexListItem = ({ count, name, image, added, category }) => (
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
      <span className="complex-swipeable-list__item-added">Added: {added}</span>
      <span className="complex-swipeable-list__item-added">Category: {category}</span>
    </div>

    <div className="complex-swipeable-list__item-count-container">
      <ComplexListItemCount count={count} />
    </div>
  </div>
);

ComplexListItem.propTypes = {
  count: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  category: PropTypes.string,
  added: PropTypes.string,
};

export default ComplexListItem;
