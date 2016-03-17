import React, { Component } from 'react'
import { connect } from 'react-redux'

class SideBar2 extends Component {
  componentWillMount() {

  }
  toggleHouseCode() {
    $('.toggle-house-code').toggle('slow')
  }

  render() {
    console.log(this.props)
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

export default connect(mapStateToProps)(SideBar2)