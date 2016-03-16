import { viewsObject } from '../components/config/views'

// change the current view when clicking on a 
// tab in the navbar
export const changeView = (view) => {
  return {
    type: 'CHANGE_VIEW',
    payload: viewsObject[view]
  }
}