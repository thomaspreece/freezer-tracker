import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.css';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { addMany } from './store/freezer_items'

store.dispatch(addMany([
{
  count: 1,
  name: "Tofu Katsu",
  image: "./images/test.jpeg",
  thumbnail: "./images/test.jpeg",
  added: "30/11/2021"
},
{
  count: 1,
  name: "Thai Green Curry",
  image: "./images/test2.jpeg",
  thumbnail: "./images/test2.jpeg",
  added: "25/10/2021"
},
{
  count: 1,
  name: "Chicken Katsu",
  image: "./images/test.jpeg",
  thumbnail: "./images/test.jpeg",
  added: "30/11/2021"
},
{
  count: 1,
  name: "Thai Red Curry",
  image: "./images/test2.jpeg",
  thumbnail: "./images/test2.jpeg",
  added: "25/10/2021"
},
{
  count: 1,
  name: "Tofu Katsu",
  image: "./images/test.jpeg",
  thumbnail: "./images/test.jpeg",
  added: "30/11/2021"
},
{
  count: 1,
  name: "Thai Green Curry",
  image: "./images/test2.jpeg",
  thumbnail: "./images/test2.jpeg",
  added: "25/10/2021"
},
{
  count: 1,
  name: "Tofu Katsu",
  image: "./images/test.jpeg",
  thumbnail: "./images/test.jpeg",
  added: "30/11/2021"
},
{
  count: 1,
  name: "Thai Green Curry",
  image: "./images/test2.jpeg",
  thumbnail: "./images/test2.jpeg",
  added: "25/10/2021"
}
]))

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
