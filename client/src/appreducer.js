import {createAction} from 'redux-actions'
import immutable from 'object-path-immutable'

const APP_USERS_SORT = 'APP_USERS_SORT'
const APP_USER_TABLES_SORT = 'APP_USER_TABLES_SORT'

export const setUsersSort = createAction(APP_USERS_SORT)
export const setUserTablesSort = createAction(APP_USER_TABLES_SORT)

const setUsersSortHandler = (state, action) => {
  const sort = action.payload
  const newState = immutable(state).set(['sort'], sort).value()
  return newState
}

const setUserTablesSortHandler = (state, action) => {
  const sort = action.payload
  const newState = immutable(state).set(['userTablesSort'], sort).value()
  return newState
}

const defaultState = {
  sort: '',
  userTablesSort: '',
}

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case APP_USERS_SORT:
      return setUsersSortHandler(state, action)
    case APP_USER_TABLES_SORT:
      return setUserTablesSortHandler(state, action)
    default:
      return state
  }
}

export default appReducer
