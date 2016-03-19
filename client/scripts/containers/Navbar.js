import React, { Component } from 'react'

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeView } from '../actions/index'
import { viewsArray } from '../components/config/views'

// navbar component:
import NavMenu from '../components/navbar/NavMenu'

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
          <div className="navbar-header">
            <NavMenu 
              counters={this.props.counters}
              changeView={this.props.changeView}
              links={viewsArray}
              currentView={this.props.ui.currentView}
            />
          </div>
        </div>
      </nav>
    )
  }
}

// gives props to this container
const mapStateToProps = (state) => {
  return {
    counters: state.counters,
    ui: state.ui
  }
}

// dispatch actions with props
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ changeView }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

