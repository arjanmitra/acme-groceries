import { createStore, applyMiddleware, combineReducers } from 'redux';
import axios from 'axios';
import thunk from 'redux-thunk';

//action types
const LOAD = 'LOAD';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const SET_VIEW = 'SET_VIEW';

//action creators-----

//set view AC
const setView = (view) => {
  return {
    type: 'SET_VIEW',
    view,
  };
};

//load data AC and thunk
const loadData = (groceries) => {
  return {
    type: LOAD,
    groceries,
  };
};

const loadDataThunk = () => {
  return async (dispatch) => {
    const groceries = (await axios.get('/api/groceries')).data;
    dispatch(loadData(groceries));
  };
};

//toggle data AC and thunk
const toggleData = (updated) => {
  return { type: UPDATE, grocery: updated };
};

const toggleDataThunk = (grocery) => {
  return async (dispatch) => {
    const updated = (
      await axios.put(`/api/groceries/${grocery.id}`, {
        purchased: !grocery.purchased,
      })
    ).data;
    dispatch(toggleData(updated));
  };
};

//create random grocery AC and thunk
const createRandomGrocery = (grocery) => {
  return { type: CREATE, grocery };
};

const createRandomGroceryThunk = () => {
  return async (dispatch) => {
    const grocery = (await axios.post('/api/groceries/random')).data;
    dispatch(createRandomGrocery(grocery));
  };
};

//create grocery AC and thunk
const createGrocery = (grocery) => {
  return { type: CREATE, grocery };
};

const createGroceryThunk = (name) => {
  return async (dispatch) => {
    const grocery = (await axios.post('/api/groceries', { name })).data;
    dispatch(createGrocery(grocery));
  };
};

const initialState = {
  groceries: [],
  view: '',
};

const reducer = (state = initialState, action) => {
  if (action.type === LOAD) {
    state = { ...state, groceries: action.groceries };
  }
  if (action.type === UPDATE) {
    state = {
      ...state,
      groceries: state.groceries.map((grocery) =>
        grocery.id === action.grocery.id ? action.grocery : grocery
      ),
    };
  }
  if (action.type === CREATE) {
    state = { ...state, groceries: [...state.groceries, action.grocery] };
  }
  if (action.type === SET_VIEW) {
    state = { ...state, view: action.view };
  }
  return state;
};

// const rootReducer = combineReducers({
//   reducer,
// });

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
export {
  setView,
  loadDataThunk,
  toggleDataThunk,
  createRandomGroceryThunk,
  createGroceryThunk,
};
