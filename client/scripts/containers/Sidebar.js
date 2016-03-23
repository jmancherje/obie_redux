import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactS3Uploader from 'react-s3-uploader'
import axios from 'axios'
import AWS from 'aws-sdk'
import $ from 'jquery'
import _ from 'underscore'
axios.defaults.headers.common['obie'] = localStorage.getItem('obie');

AWS.config.update({accessKeyId: 'AKIAJPE64XRMRH3U3RXQ', secretAccessKey: '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', region: 'us-west-1'});

class SideBar extends Component {
  constructor(props) {
    super(props)
    this.uploadImage = this.uploadImage.bind(this)
    this.mdn_upload = this.mdn_upload.bind(this)
  }

  toggleHouseCode() {
    $('.toggle-house-code').toggle('slow')
  }

  uploadFiles(event) {
    var files = event.target.files;
    var data = new FormData();
    _.each(files, function(file, i) {
      data.append('file-'+i, file);
    })
    $.ajax({
      url: '/testupload',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function(data){
        console.log(data);
      },
      error: function(err) {
        console.log('error: ', err);
      }
    });
  }

  render() {
    return (
      <aside className="col-xs-5 col-md-4 col-lg-4 side-bar-container">
        <div className="side-bar-filler">
          <img src={this.props.userImageUrl} className="userImage" height="120px" />
          <section>
            <h3 className="text-center">
              {this.props.house.name}
            </h3>
            <h4>Roommates:</h4>
            <ul className="sidebar-roommate-ul">
              {this.props.users.map((roommate, index) => 
                <li key={index} className="username-sidebar">
                  <span>
                    <img height="30" src={roommate.userImageUrl} />
                  </span>
                  <p className="lead">
                    {roommate.name}
                  </p>
                </li>
              )}
            </ul>

            <p>Select image for upload:</p>
            <input type="file" id="image_input" multiple onChange={event => this.uploadFiles(event)} />
            <button id="upload-button">upload</button>
            <p id="results">any news?</p>

            <button className="btn btn-info submit-message-button text-center" onClick={this.toggleHouseCode}>
              Invite Roommates
            </button>
            <details className="toggle-house-code">
              <p>Share this house code with your roommates</p>
              <p className="house-code">{this.props.house.code}</p>
            </details>
          </section>
        </div>
      </aside>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users,
    isLandlord: state.ui.isLandlord,
    username: state.ui.username,
    house: state.ui.house,
    userImageUrl: state.userInfo.userImageUrl
  }
}

export default connect(mapStateToProps)(SideBar)