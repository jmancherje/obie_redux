import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Router, Route, History } from 'react-router';
import { createHistory } from 'history';
import NavBar from './components/navbarComponent'
import HouseInfo from './components/houseInfoComponent'
import Notify from './components/notifyComponent'
import PendingBills from './components/pendingBillComponent'
import HouseSpecificFinance from './components/houseSpecificFinanceComponent'
import PropertyAdder from './components/addPropertyComponent'


var navbar = {};

navbar.landlordLinks = [
  {render: "Bills", text: "Finance"},
  {render: "Communication", text: "Notify"},
  {render: "Info", text: "House Info"},
  {render: "House Bills", text: "House Bills"}
]

var App = React.createClass({
  getInitialState: function() {
    return {
      view: 'Finance',
      houseCode: '',
      users: [],
      houseName: '',
      currentHouse: {},
      houseAddress: '',
      initialLoad: true,
      isLandlord: true,
      landlordHouses: [{name: "Robot House", address:"123 road lane", id:4}, {name: "Real World House", address:"466 road street", id: 8}, {name: "Full House", address: "69 road lane", id:5}]
    }
  },

  componentDidMount: function() {
    this.getHousesOwned();
    this.getUsers();
    this.getUserImage();
  },

  getHousesOwned: function() {
    $.ajax({
      url: '/properties/owned',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(houses) {
        this.setState({landlordHouses: houses});
        this.setState({currentHouse: houses[0]});
        this.setState({initialLoad: false});
        this.switchHouseView(this.state.currentHouse.id);
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    });
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
        this.state.name = url[0].name;
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
        if (!session) {
          window.location.href = '/login';
        }
        this.getHousesOwned();
      }.bind(this),
      error: function() {
        if (!localStorage.getItem('obie')) {
          window.location.href = '/login';
        }
        console.log('error getting session');
      }
    });
  },

  switchHouseView: function(houseId) {
    $.ajax({
      url: '/properties/view/' + houseId,
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(object) {
        localStorage.setItem('obie', object.token);
        var currentHouse = this.state.landlordHouses.filter(function(house, index) {
          return house.id == object.houseId;
        });
        this.setState({currentHouse: currentHouse[0]});
        this.getUserImage();
        this.getUsers();
        var view = this.state.view;
        this.renderView('Dummy');
        this.renderView(view);
      }.bind(this),
      error: function(err) {
        console.log('error', err);
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
    var context = this;
    return (
      <div>
        <NavBar {...navbar} isLandlord={this.state.isLandlord} view={this.state.view} changeView={this.renderView} />
        <div className="app-container col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <div className="col-xs-5 col-md-4 col-lg-4 side-bar-container">
            <div className="side-bar-filler">
              <ImageContainer imageUrl={this.state.imageUrl}  />
              <div>
                <h4 className="text-center">Choose Property:</h4>
                <LandlordHouses currentHouse={this.state.currentHouse} switchHouseView={this.switchHouseView} houses={this.state.landlordHouses} />
                <button className="btn btn-default add-property-button" onClick={function(){context.setState({view: "PropertyAdder"})}}>Add Property</button>
              </div>
            </div>
          </div>
          <div className="col-xs-7 col-md-8 col-lg-8 interface-container main-bar-container">
            <ContentContainer initialLoad={this.state.initialLoad} getHousesOwned={this.getHousesOwned} view={this.state.view} currentHouse={this.state.currentHouse} />
          </div>
        </div>
      </div>
    )
  }
});

var LandlordHouses = React.createClass({
  selectHouse: function(house) {
    this.props.switchHouseView(house.id);
  },

// gives class of 'selected-house' to the current house that is being shown
// will select multiple houses if they have the same name :(
// can look at changing this to houseid or house token
  isActive: function(houseId) {
    var classes = "lead house-name-list"
    if (this.props.currentHouse.id === houseId) {
      classes = classes + ' selected-house';
    }
    return classes;
  },

  render: function() {
    var context = this;
    var houseList = this.props.houses.map(function(house, index) {
      return <li className="text-center" onClick={context.selectHouse.bind(null, house)} key={index} houseInfo={house}><p className={context.isActive(house.id)}>{house.name}</p></li>
    })
    return (
      <ul className="landlord-house-ul text-center">
        {houseList}
      </ul>
    )
  }
});

var ImageContainer = React.createClass({
  render: function() {
    return <img height="120px" src={this.props.imageUrl} />
  }
});

var Dummy = React.createClass({
  render: function() {
    return <p>Dummy</p>;
  }
});

var ContentContainer = React.createClass({
  render: function() {
    if (this.props.view === 'Finance') {
      return <PendingBills currentHouse={this.props.currentHouse} initialLoad={this.props.initialLoad} view={this.props.view} />
    } else if (this.props.view === 'Notify') {
      return <Notify currentHouse={this.props.currentHouse} />
    } else if (this.props.view === 'House Info') {
      return <HouseInfo currentHouse={this.props.currentHouse} />
    } else if (this.props.view === 'Dummy') {
      return <Dummy />
    } else if (this.props.view === 'PropertyAdder') {
      return <PropertyAdder currentHouse={this.props.currentHouse} getHousesOwned={this.props.getHousesOwned} />
    } else if (this.props.view === 'House Bills') {
      return <HouseSpecificFinance currentHouse={this.props.currentHouse} />
    }
  }
});

$(".side-bar-filler").css({'height':($(".side-bar-container").height()+'px')});

ReactDOM.render(<App/>, document.getElementById('app'));


