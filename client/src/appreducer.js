import {createAction} from 'redux-actions'
import immutable from 'object-path-immutable'

const APP_USERS_SORT = 'APP_USERS_SORT'

export const setUsersSort = createAction(APP_USERS_SORT)

const setUsersSortHandler = (state, action) => {
  const sort = action.payload
  const newState = immutable(state).set(['sort'], sort).value()
  return newState
}

const appReducer = (state = {sort: ''}, action) => {
  switch (action.type) {
    case APP_USERS_SORT:
      return setUsersSortHandler(state, action)
    default:
      return state
  }
}

export default appReducer
