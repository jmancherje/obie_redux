import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Router, Route, History } from 'react-router';
import { createHistory } from 'history';
// redux
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import NavBar from './containers/Navbar'
import SideBar from './containers/SideBar'
import ContentContainer from './containers/ContentContainer'
import rootReducer from './reducers/index'

const store = createStore(rootReducer)
// views constants
import views from './components/config/views'

// import NavBar from './components/navbarComponent'
// tenant components
import MessageContainer from './components/messageComponent'
import ChoreContainer from './components/choreComponent'
import FinanceContainer from './components/financeComponent'
import LandlordMessageContainer from './components/messageLandlordComponent'



var navbar = {};
navbar.links = [
  {render: "Message", text: "Messages"},
  {render: "LandlordMessage", text: "Contact Landlord"},
  {render: "Finance", text: "Finances"},
  {render: "Chore", text: "Chores"}
];
navbar.landlordLinks = [
  {render: "Bills", text: "Pending Bills"},
  {render: "Communication", text: "Notify"},
  {render: "Info", text: "House Info"}
]

export var App = React.createClass({
  getInitialState: function() {
    return {
      view: 'Finances',
      houseCode: '',
      users: [],
      houseName: '',
      isLandlord: false,
      initialLoad: true,
      name: '',
      id: 0
    }
  },

  componentDidMount: function() {
    // this.getSession();
    this.getUserImage();
    this.getHouseCode();
    this.getUsers();
  },

  componentWillMount: function() {
    if (!localStorage.getItem('obie')) {
      window.location.href = '/login';
    }
  },

  getUsers: function() {
    $.ajax({
      url: '/users/',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(users) {
        this.state.users = users; 
        this.setState({users: this.state.users}); 
        console.log(users);
      }.bind(this)
    });
  },

  getUserImage: function() {
     $.ajax({
      url: '/users/images',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(url) {
        this.state.imageUrl = url[0].userImageUrl || "https://s-media-cache-ak0.pinimg.com/736x/fb/e1/cd/fbe1cdbc1b728fbb5e157375905d576f.jpg";
        console.log(url[0].userImageUrl)
        this.state.name = url[0].name;
        this.state.id = url[0].id;
        this.setState({imageUrl: this.state.imageUrl, name: this.state.name});
      }.bind(this),
      error: function() {
        console.log('error getting image');
      }
    });
  },

  getSession: function() {
    $.ajax({
      url: '/obie/',
      type: 'GET',
      contentType: 'application/json',
      success: function(session) {
        localStorage.setItem('obie', session);
        this.state.initialLoad = false;
        this.setState({initialLoad: this.state.initialLoad});
        this.getUserImage();
        this.getHouseCode();
        this.getUsers();
      }.bind(this),
      error: function() {
        console.log('error getting session');
      }
    });
  },

  getHouseCode: function() {
    $.ajax({
      url: '/housez/code',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(code) {
        this.setState({houseCode: code[0].token});
        this.setState({houseName: code[0].name});
      }.bind(this),
      error: function() {
        console.log('error');
      }
    });
  },

  leaveHouse: function() {
    $.ajax({
      url: '/users/leave',
      type: 'PUT',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(code) {
        // this.updateTokenAfterLeaveHouse();
        localStorage.removeItem('obie');
        window.location.href="/registration";
      }.bind(this),
      error: function() {
        console.log('error');
      }
    });
  },

  updateTokenAfterLeaveHouse: function() {
    $.ajax({
      url: '/obie/updateLeaveHouse',
      type: 'GET',
      headers: {'token': localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(token) {
        localStorage.setItem('obie', token);
      }.bind(this),
      error: function() {
        console.log('error getting session');
      }
    });
  },

  toggleHouseCode: function () {
    $('.toggle-house-code').toggle('slow');
  },
  renderView: function(view) {
    this.setState({view: view});
  },
  render: function() {
    var roommates = this.state.users.map(function(user, index) {
      return (
        <li key={index} className="username-sidebar">
          <span><img height="30" src={user.userImageUrl} /></span>  <p className="lead">  {user.name}</p>
        </li>
      )
    });
        // <NavBar {...navbar} isLandlord={this.state.isLandlord} changeView={this.renderView} view={this.state.view} />
    return (
      <div>
        <NavBar store={store} />
        <div className="app-container col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <SideBar store={store} />
          <div className="col-xs-7 col-md-8 col-lg-8 interface-container main-bar-container">
            <ContentContainer store={store} name={this.state.name} initialLoad={this.state.initialLoad} isLandlord={this.state.isLandlord} />
          </div>
        </div>
      </div>
    )
  }
});
            // <ContentContainer name={this.state.name} initialLoad={this.state.initialLoad} isLandlord={this.state.isLandlord} view={this.state.view} />

var LandlordHouses = React.createClass({
  render: function() {
    var houseList = this.props.houses.map(function(house, index) {
      return <li key={index} houseInfo={house}>{house.name}</li>
    })
    return (
      <ul className="landlord-house-ul">
        {houseList}
      </ul>
    )
  }
});

var ImageContainer = React.createClass({
  render: function() {
    return <img className="userImage" height="120px" src={this.props.imageUrl} />
  }
});

// var ContentContainer = React.createClass({
//   render: function() {
//     if (this.props.view === 'Pending Bills') {
//       return <PendingBills />
//     } else if (this.props.view === 'Notify') {
//       return <Notify />
//     } else if (this.props.view === 'House Info') {
//       return <HouseInfo />
//     } else if (this.props.view === 'Messages') {
//       return <MessageContainer />
//     } else if (this.props.view === 'Chores') {
//       return <ChoreContainer name={this.props.name} />
//     } else if (this.props.view === 'Finances') {
//       return <FinanceContainer initialLoad={this.props.initialLoad} />
//     } else if (this.props.view === 'Contact Landlord') {
//       return <LandlordMessageContainer />
//     } 
//   }
// });

$(".side-bar-filler").css({'height':($(".side-bar-container").height()+'px')});

ReactDOM.render(<App/>, document.getElementById('app'));


