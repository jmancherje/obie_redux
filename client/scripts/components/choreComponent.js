import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers';
var socket = io();



var image = {
  kitchen: "./images/chores/kitchen56.svg",
  bathroom: "./images/chores/toilet1.svg",
  laundryroom: "./images/chores/washing11.svg",
  pets: "./images/chores/dog65.svg",
  yard: "./images/chores/flowers12.svg",
  livingroom: "./images/chores/livingroom8.svg",
  bedroom: "./images/chores/bedroom3.svg",
  other: "./images/chores/garage5.svg"
}

var ChoreContainer = React.createClass({
  getInitialState: function () {
    return {
      chores: [],
      users: []
    }
  },
  componentDidMount: function() {
    this.getUsers();
    this.loadChores();
    var that = this;
    socket.on('chore', that.loadChores);
  },

  getUsers: function() {
    $.ajax({
      //eventually need to replace 1 with houseId. 
      url: '/users/',
      headers: {'token': localStorage.getItem('obie')},
      type: 'GET',
      contentType: 'application/json',
      success: function(users) {
        this.state.users = users; 
        this.setState({users: this.state.users}); 
      }.bind(this)
    });
  },

  loadChores: function () {
    $.ajax({
      //eventually need to pass in :houseId instead of 1
      url: '/chores/',
      headers: {'token': localStorage.getItem('obie')},
      type: 'GET',
      contentType: 'application/json',
      success: function (chores) {
        this.setState({chores: chores});
      }.bind(this),
      error: function (err) {
        console.log(err);
      }
    })
  },

  formSubmit: function (chore) {
    $.ajax({
      url: '/chores',
      type: 'POST',
      headers: {'token': localStorage.getItem('obie')},
      data: JSON.stringify(chore),
      contentType: 'application/json',
      success: function (data) {
        this.loadChores();
        socket.emit('chore', chore);
      }.bind(this),
      error: function(err){
        console.log("error");
      }
    });
  },

  render: function() {
    var context = this;
    var choreList = this.state.chores.map(function(item, i) {
      return <ChoreEntry name={context.props.name} loadChores={context.loadChores} key={i} chore={item} />
    })
    return (
      <div className="chore-container">
        <h2 className="text-center chore-header">Chores</h2>
        <div className="chore-list">
          {choreList}
        </div>
        <ChoreForm users={this.state.users} formSubmit={this.formSubmit}/>
      </div>
    )
  }
});

var ChoreEntry = React.createClass({
  getDate: function() {
    var date = h.getDate(this.props.chore.dueDate);
    return `${date.month}/${date.day}/${date.year}`;
  },

  updateChoreStatus: function () {
    $.ajax({
      url: '/chores/' + this.props.chore.id,
      type: 'PUT',
      headers: {'token': localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function() {
        this.props.loadChores();
      }.bind(this),
      error: function(err) {
        console.log(err);
      }.bind(this)
    })
  },

  renderButton: function() {
    if (this.props.name === this.props.chore.name) {
      return <button type='button' className='btn btn-info chore-complete' onClick={this.updateChoreStatus}>Complete</button>
    }
  },
  render: function () {
    return (
      <div className="chore-entry col-sm-12 col-md-12">
          <div className="col-xs-6 col-md-6">
            <div>
              <div className="caption">
                <h4 className="chore-name">{this.props.chore.chorename}</h4> 
                <p>{this.props.chore.name} <span> {this.getDate()} </span> </p>
              </div>
            </div>
          </div>
          <div className="col-xs-2">
              <img className="chore-image" src={image[this.props.chore.category]}></img>
          </div>
          <div className="col-sm-4 col-md-4">
            {this.renderButton()}
          </div>
      </div>
    )
  }
});

var ChoreForm = React.createClass({
  localSubmit: function (event) {
    event.preventDefault();
    var userId = this.refs.userId.value;
    var dueDate = this.refs.dueDate.value;
    var name = this.refs.choreName.value;
    var category = this.refs.category.value;
    var houseId = localStorage.getItem('houseId');
    var choreObject = {
      userId: userId,
      dueDate: dueDate,
      name: name,
      category: category,
      houseId: houseId
    }
    this.props.formSubmit(choreObject);
    this.refs.choreForm.reset()
  },

  render: function () {
    var userList = this.props.users.map(function(user, index) {   
      return <option key={user.id} value={user.id} username={user.name}>{user.name}</option>
    });
    return (
      <div>
        <form id="choreform" className="message-form form-group" ref='choreForm' onSubmit={this.localSubmit}>
          <label htmlFor="chore-input">Chore Details</label>
          <input maxLength="29" type="text" name='chore' className="form-control" ref='choreName' placeholder="Chore" required/>
          <div className="chore-div chore-input-left col-xs-4">
          <label htmlFor="user-id">Username</label>
            <select className="form-control username-input" ref='userId' required>
              {userList}
            </select>
          </div>
          <div className="chore-div col-xs-4 chore-div-middle">
            <label htmlFor="category">Category</label>
            <select name="category" id="category" className="form-control" ref="category" required>
              <option value="kitchen">Kitchen</option>
              <option value="livingroom">Living Room</option>
              <option value="yard">Yard</option>
              <option value="laundryroom">Laundry Room</option>
              <option value="bathroom">Bathroom</option>
              <option value="bedroom">Bedroom</option>
              <option value="pets">Pets</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="chore-div chore-input-right col-xs-4">
            <label htmlFor="due-date">Due Date</label>
            <input type="date" className="form-control" ref='dueDate' required/>
          </div>
          <div>
            <button className="btn btn-info submit-message-button text-center" type="submit">Submit</button>
          </div>
        </form>
      </div>
    )
  }
})

export default ChoreContainer;
