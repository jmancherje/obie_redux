$(document).ready(function() {

  $.ajax({
    url: '/obie/',
    type: 'GET',
    contentType: 'application/json',
    headers: {token: localStorage.getItem('obie')},
    success: function(session) {
      localStorage.setItem('obie', session);
    },
    error: function() {
      console.log('error getting session');
    }
  });

  var addHouse = function(house) {
    $.ajax({
      url: '/houses',
      type: 'POST',
      data: JSON.stringify(house),
      contentType: 'application/json',
      headers: {token: localStorage.getItem('obie')},
      success: function(data) {
        getHouseToken(data.insertId);
      }
    });
  };

  var getSession = function() {
    localStorage.removeItem('obie');
    $.ajax({
      url: '/obie/',
      type: 'GET',
      contentType: 'application/json',
      success: function(session) {
        localStorage.setItem('obie', session);
      }.bind(this),
      error: function() {
        console.log('error getting session');
      }
    });
  }

  var updateSession = function() {
    $.ajax({
      url: '/obie/tokenChange',
      type: 'GET',
      headers: {token: localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(session) {
        localStorage.setItem('obie', session);
        window.location.href ='/';
      }.bind(this),
      error: function() {
        console.log('error getting session');
      }
    });
  };

  var getHouseToken = function(houseId) {
    $.ajax({
      url: '/houses/token/'+houseId,
      type: 'GET',
      contentType: 'application/json',
      headers: {token: localStorage.getItem('obie')},
      success: function(data) {
        var token = data[0].token; 
        $('.join-house-alert').show(); 
        $('.join-house-info').hide();
        $('#house-code').val(token); 
      },
      error: function(error) {
        console.log('error: ', error);
      }
    });
  };


  // need to test
  // need to update query to post address too
  var createHouse = function(event) {
    event.preventDefault();
    if (!$('#create-house-form').valid()) {
      return;
    }
    if (!localStorage.getItem('obie')) {
      alert('your session expired, please login again to finish registration');
      window.location.href = '/login';
    }
    var house = {
      name: $('#house-name').val(),
      address: $('#house-address').val()
    };
    $('#create-house-div').hide('slow');
    $('#join-house-div').show('slow');
    $('#create-house-btn').hide();
    addHouse(house);
  };

  var updateLandlordHouseId = function() {
    if (!localStorage.getItem('obie')) {
      alert('your session expired, please login again to finish registration');
      window.location.href = '/login';
    }
    $.ajax({
      url: '/property/landlord/house',
      type: 'PUT',
      headers: {token: localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(data) {
        updateLandLordToken(); 
      },
      error: function(error) {
        console.log('error: ', error);
      }
    });
  };

  var updateLandLordToken = function() {
    $.ajax({
      url: '/property/landlord/tokenUpdate',
      type: 'GET',
      contentType: 'application/json',
      headers: {token: localStorage.getItem('obie')},
      success: function(data) {
        localStorage.setItem('obie', data);
        window.location.href = '/';
      },
      error: function(error) {
        console.log('error: ', error);
      }
    });
  };

  //////////// need to test
  var updateHouseWithLandlordId = function(houseToken) {
    $.ajax({
      url: '/properties/add/' + houseToken,
      type: 'PUT',
      headers: {token: localStorage.getItem('obie')},
      contentType: 'application/json',
      success: function(data) {
        updateLandlordHouseId();
        // window.location.href = '/logout';
      },
      error: function(error) {
        console.log('error updating house with landlord: ', error);
        alert('Invalid property code or property already has landlord');
      }
    });
  };
  
  // NOT USED FOR LANDLORD
  var updateUserHouseId = function(houseId) {
    $.ajax({
      url: '/houses/users',
      type: 'PUT',
      headers: {token: localStorage.getItem('obie')},
      data: JSON.stringify({houseId: houseId}),
      contentType: 'application/json',
      success: function(data) {
        updateSession();
      },
      error: function(error) {
        console.log('error: ', error);
      }
    })  
  };

  // store session:
  getSession();

  // create a house
  $('#create-house-submit').on('click', createHouse);

  // join a house
  $('#join-house-submit').on('click', function(event) {
    event.preventDefault();
    if (!$('#join-house-form').valid()) {
      return;
    }
    updateHouseWithLandlordId($('#house-code').val());
  });

  // tenant
  // show join house div on button click
  $('#join-house-btn').on('click', function(event) {
    event.preventDefault();
    $('#create-house-div').hide('slow');
    $('#join-house-div').show('slow');
  });

  // show create house div on button click
  $('#create-house-btn').on('click', function(event) {
    event.preventDefault();
    $('#create-house-div').show('slow');
    $('#join-house-div').hide('slow');
  });

  // validate forms:
  $('#create-house-form').validate();
  $('#join-house-form').validate();

});
