import React, { Component } from 'react'
import $ from 'jquery'
import h from '../helpers'

const socket = io()

// create classes
// class NavBar2 extends Component {
//   constructor() {
//     return {
//       newMessages: 0,
//       newLandlordMessages: 0,
//       newFinance: 0,
//       newChores: 0
//     }
//   }

//   componentDidMount() {
//     const context = this
//     socket.on('message', () => {
//       if (context.props.view !== "Messages") {
//         context.state.newMessages++;
//         context.setState({newMessages: context.state.newMessages});
//       }
//     })
//     socket.on('llmessage', () => {
//       if (context.props.view !== "Contact Landlord") {
//         context.state.newLandlordMessages++;
//         context.setState({newLandlordMessages: context.state.newLandlordMessages});
//       }  
//     });
//     socket.on('chore', () => {
//       if (context.props.view !== "Chores") {
//         context.state.newChores++;
//         context.setState({newChores: context.state.newChores});
//       }  
//     });
//     socket.on('bill', () => {
//       if (context.props.view !== "Finances") {
//         context.state.newFinance++;
//         context.setState({newFinance: context.state.newFinance});
//       }  
//     });
//   }

//   resetCount(view) {
//     if (view === "Messages") {
//       this.setState({newMessages:0})
//     } else if (view === "Contact Landlord") {
//       this.setState({newLandlordMessages:0})
//     } else if (view === "Finances") {
//       this.setState({newFinance:0})
//     } else if (view === "Chores") {
//       this.setState({newChores:0})
//     }
//   }

//   render() {
//     return (
//       <nav className="navbar navbar-default">
//         <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
//           <div className="navbar-header">
//             <NavMenu 
//               count={this.state}
//               changeView={this.props.changeView}
//               links={this.props.links}
//               resetCount={this.resetCount}
//             />
//           </div>
//         </div>
//       </nav>
//     );
//   }
// }

var NavBar = React.createClass({
  getInitialState: function() {
    return {
      newMessages: 0,
      newLandlordMessages: 0,
      newFinance: 0,
      newChores: 0
    }
  },
  resetCount: function(view) {
    if (view === "Messages") {
      this.setState({newMessages:0})
    } else if (view === "Contact Landlord") {
      this.setState({newLandlordMessages:0})
    } else if (view === "Finances") {
      this.setState({newFinance:0})
    } else if (view === "Chores") {
      this.setState({newChores:0})
    }
  },
  componentDidMount: function() {
    var context = this;
    socket.on('message', function() {
      if (context.props.view !== "Messages") {
        context.state.newMessages++;
        context.setState({newMessages: context.state.newMessages});
      }  
    });
    socket.on('llmessage', function() {
      if (context.props.view !== "Contact Landlord") {
        context.state.newLandlordMessages++;
        context.setState({newLandlordMessages: context.state.newLandlordMessages});
      }  
    });
    socket.on('chore', function() {
      if (context.props.view !== "Chores") {
        context.state.newChores++;
        context.setState({newChores: context.state.newChores});
      }  
    });
    socket.on('bill', function() {
      if (context.props.view !== "Finances") {
        context.state.newFinance++;
        context.setState({newFinance: context.state.newFinance});
      }  
    });
  },
  render: function(){
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <div className="navbar-header">
            <NavMenu count={this.state} changeView={this.props.changeView} links={this.props.links} resetCount={this.resetCount} />
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
    var context=this;
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
    if (view === "Messages" && this.props.count.newMessages > 0) {
      return this.props.count.newMessages
    } else if (view === "Contact Landlord" && this.props.count.newLandlordMessages > 0) {
      return this.props.count.newLandlordMessages
    } else if (view === "Finances" && this.props.count.newFinance > 0) {
      return this.props.count.newFinance
    } else if (view === "Chores" && this.props.count.newChores > 0) {
      return this.props.count.newChores
    }
  },
  render: function(){
    return(
      <li className="inner-flex"><a onClick={this.changeView}>{this.props.text} <span className="notification-count">{this.showCount(this.props.text)}</span></a></li>
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


export default NavBar;
