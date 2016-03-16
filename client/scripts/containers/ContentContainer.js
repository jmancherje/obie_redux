import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MessageContainer from '../components/messageComponent'
import ChoreContainer from '../components/choreComponent'
import FinanceContainer from '../components/financeComponent'
import LandlordMessageContainer from '../components/messageLandlordComponent'

class ContentContainer2 extends Component {
  render() {
    console.log(this.props)
    if (this.props.view === 'messages') {
      return <MessageContainer />
    } else if (this.props.view === 'chores') {
      return <ChoreContainer name={this.props.name} />
    } else if (this.props.view === 'finances') {
      return <FinanceContainer initialLoad={this.props.initialLoad} />
    } else if (this.props.view === 'contact_landlord') {
      return <LandlordMessageContainer />
    } 
  }
}

const mapStateToProps = (state) => {
  return {
    view: state.ui.currentView.render
  }
}

export default connect(mapStateToProps)(ContentContainer2)