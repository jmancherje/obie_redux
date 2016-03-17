import { viewsObject } from '../components/config/views'

const INITIAL_STATE = {
  messages: 0,
  chores: 1,
  contact_landlord: 0,
  finances: 0
}

export const counterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNTER':
      let count = state[action.payload]++
      let newState = Object.assign({}, state)
      newState[action.payload] = count
      return newState
    case 'RESET_COUNTER':
      newState = Object.assign({}, state)
      newState[action.payload] = 0
      return newState
    default:
      return state
  }
}