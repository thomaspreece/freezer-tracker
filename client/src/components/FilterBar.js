import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import { SORTS } from '../store/filters'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react";
import Autosuggest from 'react-autosuggest'

import './FilterBar.scss';

import { setSort, setFilter } from '../store/filters'

function FilterBar() {
    const sort = useSelector((state) => state.filters.sort)
    const filter = useSelector((state) => state.filters.filter)
    const items = useSelector((state) => state.freezerItems.items)
    const dispatch = useDispatch()

    const [suggestions, setSuggestions] = useState([]);

    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      return inputLength === 0 ? [] : items.filter(item =>
        item.name.toLowerCase().slice(0, inputLength) === inputValue
      );
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    const getSuggestionValue = suggestion => suggestion.name;

    // Use your imagination to render suggestions.
    const renderSuggestion = suggestion => (
      <div>
        {suggestion.name}
      </div>
    );

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    const onSuggestionsFetchRequested = ({ value }) => {
      setSuggestions(getSuggestions(value));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
      setSuggestions([]);
    };

    const onDropdownSelect = (sort) => (eventKey, event) => {
      dispatch(setSort(sort));
    }

    const onChange = (event, { newValue }) => {
      dispatch(setFilter(newValue));
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a filter',
      value: filter,
      onChange: onChange
    };

    return (
      <div className="filters-container">
        <div className="filters-container__label">Sort:</div>
        <div className="filters-container__sort">
          <DropdownButton title={sort}>
            {Object.values(SORTS).map((sort) => {
                return (<Dropdown.Item onClick={onDropdownSelect(sort)}>{sort}</Dropdown.Item>)
            })}
          </DropdownButton>
        </div>
        <div className="filters-container__label">Search:</div>
        <div className="filters-container__search">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
      </div>

    );
}

export default FilterBar;
