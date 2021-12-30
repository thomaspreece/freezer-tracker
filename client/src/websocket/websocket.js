import {setCountById, add} from '../store/freezer_items'
import { STATUSES, setStatus } from '../store/websocket'

export const setupWebsocket = (dispatch) => {
  const ws = new WebSocket(`ws://${window.location.host}/api/ws`)

  ws.onopen = () => {
    // on connecting, do nothing but log it to the console
    console.log('WS connected')
    dispatch(setStatus(STATUSES.CONNECTED))
  }

  ws.onmessage = evt => {
    // listen to data sent from the websocket server
    const message = JSON.parse(evt.data)

    switch(message.type) {
      case "updatedCount":
        dispatch(setCountById({
          id: message.payload.id,
          count: message.payload.count
        }))
        break;
      case "newItem":
        dispatch(add(message.payload))
        break;
      default:
        console.log('Unknown WS Message', message)
    }
  }

  ws.onclose = () => {
    console.log('WS disconnected')
    dispatch(setStatus(STATUSES.DISCONNECTED))

    setTimeout(() => {
      setupWebsocket(dispatch);
    }, 1000);
  }


  ws.onerror = (err) => {
    console.error('WS encountered error: ', err);
    ws.close();
  };
}
