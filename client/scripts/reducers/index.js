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

const users = (state, action) => {
  return [
    {
      email: "joeyholland15@gmail.com",
      id: 3,
      name: "Joey Holland",
      userImageUrl: "http://i.imgur.com/JZVDw4P.png"
    },
    {
      email: "mancherje.justin@gmail.com",
      id: 5,
      name: "Justin Mancherje",
      userImageUrl: "http://i.imgur.com/BnMK0CX.png"
    },
    {
      email: "lylynguyen812@gmail.com",
      id: 6,
      name: "Lyly Nguyen",
      userImageUrl: "http://i.imgur.com/BIrhPKl.png"
    },
    {
      email: "kartikwuzhere@gmail.com",
      id: 7,
      name: "Kartik Vempati",
      userImageUrl: "http://i.imgur.com/1kay2Vk.png"
    }
  ]
}

const userInfo = (state, action) => {
  return {
    userImageUrl: "http://i.imgur.com/BnMK0CX.png" 
  }
}


const rootReducer = combineReducers({
  ui,
  counters,
  content,
  users,
  userInfo
});

export default rootReducer