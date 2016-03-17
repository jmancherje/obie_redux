import { combineReducers } from 'redux'
import { uiReducer as ui } from './ui_reducer'
import { counterReducer as counters } from './counter_reducer'

const content = (state, action) => {
  return {
    chores: [],
    finances: {
      payment: [],
      bills: []
    },
    landlordMessages: [],
    messages: []
  }
}


const rootReducer = combineReducers({
  ui,
  counters,
  content
});

export default rootReducer