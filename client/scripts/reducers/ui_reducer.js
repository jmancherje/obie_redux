import { viewsObject } from '../components/config/views'

const INITIAL_STATE = { 
  isLandlord: false,
  currentView: viewsObject.finances,
  username: 'Justin Mancherje',
  house: {
    code: 'ABES243FSES',
    name: 'Party House'
  }
}

// set ui properties on state
const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return Object.assign({}, state, {
        currentView: action.payload
      })
    default:
      return state
  }
}

export default uiReducer