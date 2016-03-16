import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers';
var socket = io();

var formatPrice = function(cents) {
  return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
};


var houseSpecificFinance = React.createClass({
  getInitialState: function() {
    return {
      bills: [],
      paymentsOwed: [], 
      billHistory: [],
      paymentHistory: [],
      users: []
    }
  },

  componentDidMount: function() {
    this.getUsers(); 
    this.loadPayments();
    socket.on('bill', this.loadPayments);
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
  
  addBill: function(bill) {
    $.ajax({
      url: '/payment/bill',
      headers: {'token': localStorage.getItem('obie')},
      type: 'POST',
      data: JSON.stringify(bill),
      contentType: 'application/json',
      success: function(id) {
        this.createPayments(id)
        this.loadBills();
        socket.emit('bill');
      }.bind(this)
    });
  },

  addPayment: function(payment) {
    $.ajax({
      url: '/payment',
      headers: {'token': localStorage.getItem('obie')},
      type: 'POST',
      data: JSON.stringify(payment),
      contentType: 'application/json',
      success: function(data) {
        // this.loadPayments()
        socket.emit('bill');
        
      }
    });
  },

  createPayments: function(billId) {
    var users = this.state.users;
    for(var i = 0; i < users.length; i++) {
      if(users[i].selected === true) {
        var payment = {
          billId: billId, //need to figure this out
          userId: users[i].id,
          amount: users[i].total
        }
        this.addPayment(payment);
        this.getUsers();
        setTimeout(this.loadPayments, 500);
      }
    }
  },

  loadBills: function() {
    $.ajax({
      url: '/payment/pay',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(bills) {
        this.state.bills = bills; 
        this.setState({bills: this.state.bills});
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    })
  },
  
  loadPayments: function () {
    $.ajax({
      url: '/payment/owed/' + this.props.currentHouse.id,
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': localStorage.getItem('obie')},
      success: function(payments) {
        this.setState({paymentsOwed: payments});
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    })
  },

  render: function() {
    var context = this;
    var billList = this.state.bills.map(function(item, i) {
      return <BillEntry loadBills={context.loadBills} key={i} bill={item} />
    }); 
    var paymentsOwedList = this.state.paymentsOwed.map(function(item, i) {
      return <PaymentOwedEntry key={i} paymentOwed={item} />
    });
    return (
      <div className="finance-container">
        <h3 className="text-center">{this.props.currentHouse.name}: Pending Charges</h3>
        <div className="finance-list">
          <div className='bill-list'>
            {paymentsOwedList}
          </div>
        </div>
        <BillForm createPayments={this.createPayments} addPayment={this.addPayment} addBill={this.addBill} users={this.state.users}/>
      </div>
    )
  }
});

var BillEntry = React.createClass({
  getDate: function() {
    var date = h.getDate(this.props.bill.dueDate);
    return `${date.month}/${date.day}/${date.year}`;
  },

  createVenmoPayment: function(event) {
    event.preventDefault();
    var obj = {};
    obj.id = this.props.bill.paymentId;
    obj.email = this.props.bill.whoIsOwedEmail;
    obj.amount = this.props.bill.amount;
    obj.note = this.props.bill.billName;
    this.makeVenmoPayment(obj);
  },

  makeVenmoPayment: function(venmoData) {
    $.ajax({
      url: '/auth/venmo/payment',
      headers: {'token': localStorage.getItem('obie')},
      type: 'POST',
      data: JSON.stringify(venmoData),
      contentType: 'application/json',
      success: function(data) {
        this.markPaymentAsPaid(venmoData.id);
      }.bind(this)
    });
  },

  markPaymentAsPaid: function(paymentId) {
    $.ajax({
      url: '/payment/' + paymentId,
      type: 'PUT',
      headers: {'token': localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(data) {
        this.props.loadBills();
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="bill-entry-container">
        <div className="row">
          <div className="col-xs-8">
            <p>You owe <span className="who-is-owed">{this.props.bill.whoIsOwed}</span></p> 
            <p><span className="who-is-owed">{formatPrice(this.props.bill.amount * 100)}</span> for <span className="who-is-owed">{this.props.bill.billName}</span></p>
            <p> by {this.getDate()}</p>
          </div>
          <div className="col-xs-4">
            <button className='pay-button btn btn-default' onClick={this.createVenmoPayment}>Pay</button>
          </div>
        </div>
      </div>
    )
  }
}); 

var PaymentOwedEntry = React.createClass({
  getDate: function() {
    var date = h.getDate(this.props.paymentOwed.dueDate);
    return `${date.month}/${date.day}/${date.year}`;
  },
  render: function() {
    return (
      <div className="bill-entry-container">
        <p><span className="glyphicon glyphicon-unchecked"></span><span className="who-is-owed"> {this.props.paymentOwed.ower}</span> owes you
        <span className="who-is-owed"> {formatPrice(this.props.paymentOwed.amount * 100)}</span> for <span className="who-is-owed">{this.props.paymentOwed.billName}</span></p>
        <p> by {this.getDate()}</p>
      </div>
    )
  }
})

var BillForm = React.createClass({
  getInitialState: function() {
    return {
      splitEvenly: false
    }
  },
  splitEvenly: function(event) {
    event.preventDefault();
    //access this.refs.amount.value
    var amount = this.refs.total.value;
    //divide total by number of roommates 
    var costPerUser = amount/this.props.users.length;
    var costPerUser = Math.ceil(costPerUser * 100) / 100;
    //iterate through users
    for(var i = 0; i < this.props.users.length; i++) {
      //set the user total to costPerUser
      this.props.users[i].total = costPerUser;
      //invert selected property
      this.props.users[i].selected = true;
    };
    this.createBill(null, true);
  },
  customSplit: function(event) {
    event.preventDefault();
    var updateSplitEvenly = this.state.splitEvenly ? false : true;
    if (this.state.splitEvenly) {
      updateSplitEvenly = false;
      $('.interface-container').css('min-height', '330px')
    } else {
      updateSplitEvenly = true;
      $('.interface-container').css('min-height', '590px')
    }
    this.setState({
      splitEvenly: updateSplitEvenly
    });
  },
  createBill: function(event, splitEvenly) {
    //prevent default event action
    if (splitEvenly !== true) splitEvenly = false;
    if (event) {
      event.preventDefault();
    }
    var totalsArray = this.props.users.map(function(item, i) {
      return parseFloat(item.total); 
    });
    var customTotal = totalsArray.reduce(function(acc, curr) {
      if (!curr) {
        curr = 0;
      }
      return acc += curr; 
    }, 0); 
    //var userId = localStorage.getItem('userId');
    //create bill object based on user input
    var bill = {
      //on top of these, need access to the userId of
      //the person who created and access to all of the
      //users checked on the form and what they owe.
      //think about creating separate payment objects
      //in a different payment function for these. 
      //userId: userId,
      total: this.refs.total.value,
      name: this.refs.name.value,
      dueDate: this.refs.dueDate.value
    };
    if(!splitEvenly && customTotal !== parseFloat(bill.total)) {
      // $('<div id="failure" class="alert alert-danger"><strong>Nerd!</strong> Get better at math.</div>').insertBefore('#bill-submit');
      $('#failure').show();
    } else {
      //call addBill with this object. 
      this.props.addBill(bill); 
      //reset input fields
      this.refs.billForm.reset();
      $( "#failure" ).hide();
      this.state.splitEvenly = false;
      // this.setState({
      //   splitEvenly: this.state.splitEvenly
      // });
      // $('.interface-container').css('min-height', '330px')
    }
  },

  render: function() {
    var userList = this.props.users.map(function(item, i) {
      item.selected = false; 
      return <UserEntry key={i} user={item} />
    }); 
    return (
      <div className='bill-form'>
        <form action="submit" ref='billForm' className="form-group form-bottom" onSubmit=''>
          <div className='input'>
            <div className="input-group full-width-input">
              <label htmlFor="bill-name">New Bill Name:</label>
              <input maxLength="29" type="text" id="bill-name" ref='name' placeholder="October Rent" className="form-control" required />
            </div>
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="bill-amount">Total</label> 
                <div className="input-group">
                  <div className="input-group-addon">$</div>
                  <input type="number" id="bill-amount" ref='total' className="form-control" required/>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="input-group full-width">
                  <label htmlFor="bill-due-date">Due Date</label>
                  <input type="date" id="bill-due-date" ref='dueDate' className="form-control" required/>
                </div>
              </div>
            </div>
            <button className="btn btn-info btn-left" onClick={this.splitEvenly}>Split Evenly</button>
            <button className="btn btn-info btn-right" onClick={this.customSplit}>Custom Split</button>
            {this.state.splitEvenly ? <CustomSplitForm createBill={this.createBill} userList={userList} users={this.props.users} /> : null}
          </div>
        </form>
      </div>
    )
  }
});

var CustomSplitForm = React.createClass({
  render: function() {
    return (
      <div className="custom-split-container">
        <ul className='split-bill-user-list'>
          {this.props.userList}
        </ul>
        <div id="failure" className="alert alert-danger"><strong>Nerd!</strong> Get better at math.</div>
        <button id='bill-submit' className="btn btn-info" onClick={this.props.createBill}>Submit Bill</button>
      </div>
    )
  }
})

var UserEntry = React.createClass({
  setValue: function(id) {
    this.props.user.selected = true;
    this.props.user.total = this.refs[id].value;
    if (!this.refs[id].value) {
      this.props.user.selected = false;
    }
  },

  render: function() {
    return (
      <li className="split-bill-user-entry">
        <div className="form-group custom-split-user">
          <p className="lead">{this.props.user.name}</p>
          <div className="input-group">
            <div className="input-group-addon">$</div>
            <input className="form-control" id="user-split-input" onKeyUp={this.setValue.bind(this, this.props.user.id)} ref={this.props.user.id} type='number'/>
          </div>
        </div>
      </li>
    )
  }
})

export default houseSpecificFinance;
