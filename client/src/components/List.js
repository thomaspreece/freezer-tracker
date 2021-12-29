import { useSelector, useDispatch } from 'react-redux'

import Alert from 'react-bootstrap/Alert'
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

import Icon from '@mdi/react'
import { mdiPlus, mdiMinus } from '@mdi/js'

import ComplexListItem from './ComplexListItem';
import ComplexSwipeContent from './ComplexSwipeContent';

import { SORTS } from '../store/filters';
import { STATUSES } from '../store/websocket';

import { applyStringFilterToItem } from '../utils/utils'

import {
  changeItemCount
} from '../store/freezer_items'

const alphabeticalSortAsc = (a,b) => {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

const alphabeticalSortDsc = (a,b) => {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return 1;
  }
  if (nameA > nameB) {
    return -1;
  }

  // names must be equal
  return 0;
}

const addedSort = (a,b) => {
  const datePartsA = a.added.split("/");
  const datePartsB = b.added.split("/");
  var dateA = new Date(datePartsA[2], datePartsA[1] - 1, +datePartsA[0]);
  var dateB = new Date(datePartsB[2], datePartsB[1] - 1, +datePartsB[0]);
  if (dateA > dateB) {
    return 1;
  }
  if (dateA < dateB) {
    return -1;
  }

  // names must be equal
  return 0;
}

function List() {
  const dispatch = useDispatch()

  const sort = useSelector((state) => state.filters.sort)
  const filter = useSelector((state) => state.filters.filter)
  const itemsStatus = useSelector((state) => state.freezerItems.status)
  const itemsUpdateStatus = useSelector((state) => state.freezerItems.updateStatus)
  const websocketStatus = useSelector((state) => state.websocket.status)
  const items = applyStringFilterToItem(useSelector((state) => state.freezerItems.items)
    .filter((item) => item.count > 0), filter)

  switch(sort) {
    case SORTS.ALPHA_ASC:
      items.sort(alphabeticalSortAsc)
      break;
    case SORTS.ALPHA_DSC:
      items.sort(alphabeticalSortDsc)
      break;
    case SORTS.ADDED:
      items.sort(addedSort)
      break;
    default:
  }

    const swipeRightOptions = (id) => ({
      content: (
        <ComplexSwipeContent
          icon={<Icon path={mdiMinus}/>}
          label="Minus"
          position="left"
        />
      ),
      action: () => {
        dispatch(changeItemCount({
          id,
          count: -1
        }))
      }
    });

    const swipeLeftOptions = (id) => ({
      content: (
        <ComplexSwipeContent
          icon={<Icon path={mdiPlus}/>}
          label="Plus"
          position="right"
        />
      ),
      action: () => {
        dispatch(changeItemCount({
          id,
          count: 1
        }))
      }
    });

    return (
      <div>
      {
        itemsUpdateStatus === "error" ? <Alert variant={'danger'}>
          Failed to change item count
        </Alert> : null
      }
      {
        itemsStatus === "pending" ? <Alert variant={'info'}>
          Refreshing Items
        </Alert> : null
      }
      {
        itemsStatus === "error" ? <Alert variant={'danger'}>
          Failed to refresh items
        </Alert> : null
      }
      {
        websocketStatus === STATUSES.DISCONNECTED ? <Alert variant={'danger'}>
          Websocket Disconnected - Live Updates Offline
        </Alert> : null
      }
        <SwipeableList>
          {items.map(({ id, count, name, thumbnail, added }) => (
            <SwipeableListItem
              key={id}
              threshold={0.25}
              swipeLeft={swipeLeftOptions(id)}
              swipeRight={swipeRightOptions(id)}
            >
              <ComplexListItem
                count={count}
                name={name}
                image={thumbnail}
                added={added}
              />
            </SwipeableListItem>
          ))}
        </SwipeableList>
      </div>
    );
}

export default List;
