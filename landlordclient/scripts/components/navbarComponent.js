import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers';
var socket = io();

// create classes
var NavBar = React.createClass({
  getInitialState: function() {
    return {
      newLandlordMessages: 0
    }
  },
  resetCount: function(view) {
    if (view === "Notify") {
      this.setState({newLandlordMessages: 0});
    }
  },
  componentDidMount: function() {
    var context = this;
    socket.on('llmessage', function() {
      if (context.props.view !== "Notify") {
        context.state.newLandlordMessages++;
        context.setState({newLandlordMessages: context.state.newLandlordMessages});
      }  
    });
  },
  render: function(){
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <div className="navbar-header">
            <NavMenu resetCount={this.resetCount} count={this.state.newLandlordMessages} changeView={this.props.changeView} links={this.props.isLandlord ? this.props.landlordLinks : this.props.links} />
          </div>
        </div>
      </nav>
    );
  }
});

var NavMenu = React.createClass({
  logout: function() {
    window.localStorage.removeItem('obie');
    window.location.href = "/logout";
  },
  render: function(){
    var context = this;
    var changeView = this.props.changeView;
    var links = this.props.links.map(function(link, i){
      if(link.dropdown) {
        return (
          <NavLinkDropdown links={link.links} key={i} text={link.text} />
        );
      }
      else {
        return (
          <NavLink count={context.props.count} resetCount={context.props.resetCount} changeView={changeView} className="flex-children" linkTo={link.linkTo} key={i} text={link.text} render={link.render} />
        );
      }
    });
    return (
      <ul className="nav navbar-nav flexbox">
        <li className="flex-children">
          <img src="./images/obie_logo.png" height="30px" />
        </li>
        {links}
        <li>
          <a onClick={this.logout}>Logout</a>
        </li>
      </ul>
    );
  }
});

var NavLink = React.createClass({
  changeView: function() {
    this.props.changeView(this.props.text);
    this.props.resetCount(this.props.text);
  },
  showCount: function(view) {
    if (view === "Notify" && this.props.count > 0) {
      return this.props.count
    }
  },
  render: function(){
    return(
      <li className="inner-flex"><a onClick={this.changeView}>{this.props.text}<span className="notification-count"> {this.showCount(this.props.text)}</span></a></li>
    );
  }
});

// set data
var navbar = {};
navbar.brand = {linkTo: "#", text: "React Bootstrap Navbar"};
navbar.links = [
  {render: "Message", text: "Messages"},
  {render: "Finance", text: "Finances"},
  {render: "Chore", text: "Chores"}
];

// render NavBar
// ReactDOM.render(
//   <NavBar {...navbar} />,
//   document.getElementById("navbar")
// );

export default NavBar;