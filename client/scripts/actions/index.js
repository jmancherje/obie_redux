import { viewsObject } from '../components/config/views'

// change the current view when clicking on a 
// tab in the navbar
export const changeView = (view) => {
  return {
    type: 'CHANGE_VIEW',
    payload: viewsObject[view]
  }
}

export const incrementCount = (view) => {
  return {
    type: 'INCREMENT_COUNTER',
    payload: viewsObject[view].render
  }
}