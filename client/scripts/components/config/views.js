import _ from 'underscore'

const viewsObjectLandlord = {
  pending_bills: {
    text: 'Pending Bills',
    render: 'pending_bills'
  },
  notify: {
    text: 'Notify',
    render: 'notify'
  },
  house_info: {
    text: 'House Info',
    render: 'house_info'
  }
}

export const viewsObject = {
  messages: {
    text: 'Messages',
    render: 'messages'
  },
  contact_landlord: {
    text: 'Contact Landlord',
    render: 'contact_landlord'
  },
  chores: {
    text: 'Chores',
    render: 'chores'
  },
  finances: {
    text: 'Finances',
    render: 'finances'
  }
}

export const viewsArray = _.reduce(viewsObject, (array, view) => {
  array.push(view)
  return array
}, [])


// export viewsObject
// export viewsArray