import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import h from '../helpers';

var formatPrice = function(cents) {
  return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
};


var pendingBills = React.createClass({
  getInitialState: function() {
    return {
      bills: [],
      paymentsOwed: [], 
      billHistory: [],
      paymentHistory: [],
      users: [],
    }
  },

  componentDidMount: function() {
    if (this.props.initialLoad) {
      setTimeout(this.loadData, 500)
    } else {
      this.loadData();
    }
  },

  loadData: function() {
    this.loadBills();
    this.getUsers(); 
    this.loadPayments();
    this.loadBillHistory();
    this.loadPaymentHistory();
  },

  loadBillHistory: function() {
    $.ajax({
      url: '/payment/completed',
      type: 'GET',
      headers: {'token': localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(bills) {
        this.state.billHistory = bills;
        this.setState({billHistory: this.state.billHistory});
      }.bind(this)
    });
  },

  loadPaymentHistory: function() {
    $.ajax({
      url: '/payment/completed/owed',
      headers: {'token': localStorage.getItem('obie')},
      type: 'GET',
      contentType: 'application/json',
      success: function(payments) {
        this.state.paymentHistory = payments; 
        this.setState({paymentHistory: this.state.paymentHistory}); 
      }.bind(this)
    });
  },

  getUsers: function() {
    $.ajax({
      //eventually need to replace 1 with houseId. 
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

  //addBill is a function that will take a new created bill and post it
  //to the database. However, we don't have that route set up yet,
  //and need to verify schema as well. This should go in finance container. 

  //userId will be the user who created the bill
  //total 
  //name
  //dueDate
  //also need info on who owes what for the bill (checklist)
  
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
        console.log("payment added");
      }
    });
  },

  createPayments: function(billId) {
    // event.preventDefault();
    var users = this.state.users;
    //iterate through users
    for(var i = 0; i < users.length; i++) {
      if(users[i].selected === true) {
        //create payment object
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
    var token = localStorage.getItem('obie'); 
    $.ajax({
      url: '/payment/pay',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': token},
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
    var token = localStorage.getItem('obie');
    $.ajax({
      url: '/payment/owed',
      type: 'GET',
      contentType: 'application/json',
      headers: {'token': token},
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
    var billHistoryList = this.state.billHistory.map(function(item, i) {
      return <BillHistory key={i} history={item} />
    });
    var paymentHistoryList = this.state.paymentHistory.map(function(item, i) {
      return <PaymentHistory key={i} history={item} />
    });
    return (
      <div className="finance-container">
        <h2 className="text-center">Finance</h2>
        <div className="finance-list-house-specific">
          <div className='payments-owed-list'>
            <h4 className="text-center">Pending Payments</h4>
            {paymentsOwedList}
          </div>
          <div className='payment-history-list'>
            <h4 className="text-center">Payment History</h4>
            {paymentHistoryList}
          </div>
        </div>
      </div>
    )
  }
});

var BillEntry = React.createClass({
  getDate: function() {
    var date = h.getDate(this.props.bill.dueDate);
    console.log(date);
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

var BillHistory = React.createClass({
  render: function() {
    return (
      <div>
        You paid {this.props.history.whoIsOwed} ${this.props.history.amount} for {this.props.history.billName} 
      </div>
    )
  }
})

var PaymentHistory = React.createClass({
  getDate: function() {
    var date = h.getDate(this.props.history.dueDate);
    return `${date.month}/${date.day}/${date.year}`;
  },
  render: function() {
    return (
      <div className="completed-payment-container">
        <p><span className="glyphicon glyphicon-check"></span><span className="who-is-owed"> {this.props.history.ower}</span> Paid you  
        <span className="who-is-owed"> {formatPrice(this.props.history.amount * 100)}</span> for <span className="who-is-owed">{this.props.history.billName}</span> </p>
        <p> on {this.getDate()}</p>
      </div>
    )
  }
})

var UserEntry = React.createClass({
  setValue: function(id) {
    this.props.user.selected = true;
    this.props.user.total = this.refs[id].value;
    console.log('this.refs[id].value', !this.refs[id].value);
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

export default pendingBills;
