import { createReducer } from 'redux-starter-kit';

const testReducer = createReducer([], {
  ADD: (state, action) => {
    // "mutate" the array by calling push()
    state.push(action.payload);
  },
  TOGGLE: (state, action) => {
    const todo = state[action.payload.index];
    // "mutate" the object by overwriting a field
    todo.completed = !todo.completed;
  },
  REMOVE: (state, action) => state.filter((todo, i) => i !== action.payload.index),
});

export default testReducer;
