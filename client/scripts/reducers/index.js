import { combineReducers } from 'redux'
import uiReducer from './ui_reducer'

const content = (state, action) => {
  return {
    chores: [],
    finances: {
      payment: [],
      bills: []
    },
    landlordMessages: [],
    messages: [],
    counters: {
      messages: 4,
      chores: 1,
      contact_landlord: 7,
      finances: 5
    }
  }
}

const rootReducer = combineReducers({
  ui: uiReducer,
  content
});

export default rootReducer