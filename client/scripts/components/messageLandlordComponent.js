import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers.js';

var socket = io();

var LandlordMessageContainer = React.createClass({

  getInitialState: function() {
    setTimeout(this.loadMessages, 500);
    this.loadMessages()
    return {
      messages: []
    }
  },

  componentDidMount: function () {
    var context=this;
    socket.on('llmessage', context.loadMessages);
  },

  loadMessages: function() {
    $.ajax({
      url: '/messages/landlord',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(messages) {
        this.setState({messages: messages});
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    })
  },

  formSubmit: function(message) {
    $.ajax({
      url: '/messages/landlord',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(data) {
        this.loadMessages();
        socket.emit('llmessage', message);
      }.bind(this)
    });

  },

  render: function() {
    var messageList = this.state.messages.map(function(item, i) {
      return <MessageEntry key={i} message={item} />
    })
    return (
      <div className="message-container">
        <h2 className="text-center">Landlord Chat</h2>
        <div className="message-list">
          {messageList}
        </div>
        <MessageForm formSubmit={this.formSubmit}/>
      </div>
    )
  }
});

var MessageEntry = React.createClass({
  decideClassName: function() {
    if (this.props.message.isLandlord) {
      return " message-entry-landlord"
    }
    return "message-entry";
  },
  render: function() {
    return (
      <div className={this.decideClassName()}>
        <div className="row">
          <div className="col-xs-3 message-entry-left-box">
            <div className="profile-image">
              <img src={this.props.message.userImageUrl || "http://www.getparade.com/media/imagic/square3.jpg"} width="50px" alt="user venmo image"/>
            </div>
          </div>
          <div className="col-xs-9 message-right-container">
            <div className="username">
              <p>{this.props.message.name}</p>
            </div>
            <div className="message-text">
              <p>{this.props.message.text}</p>
            </div>
            <div className="time-stamp">
              <p>{h.getDateTime(this.props.message.time).toString()}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var MessageForm = React.createClass({
  localSubmit: function(event) {
    event.preventDefault();
    var messageText = this.refs.message.value;

    var messageObj = {
      text: messageText
    }
    this.props.formSubmit(messageObj);
    this.refs.messageForm.reset()
  },
  randomPlaceholder: function() {
    var placeholders = ["You guys are the worst", "Someone get me the pigeon stick..", "Wash your dishes", "Great Party!", "Who ordered the stripper?", "Where's my dog?", "Someone bring in the mail for me", "~(_8^(I)", "Joey at all the pizza", "Obie's dog shit on the floor", "so==[]::::::::::::::::>", "Clean the shit off the floor, Obie", "ͼ(ݓ_ݓ)ͽ"];
    var randomIndex = Math.floor(Math.random()*placeholders.length);
    return placeholders[randomIndex];
  },
  render: function() {
    return (
      <div>
        <form className="message-form form-group" ref='messageForm' onSubmit={this.localSubmit}>
          <label htmlFor="message-input">Message</label>
          <input name="comment" placeholder={this.randomPlaceholder()} className="form-control" id="message-input" ref='message' />
          <button type="submit" className="btn btn-info submit-message-button text-center">Submit</button>
        </form>
      </div>
    )
  }
})

export default LandlordMessageContainer;
