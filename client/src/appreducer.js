import {createAction} from 'redux-actions'
import immutable from 'object-path-immutable'

const APP_USERS_SORT = 'APP_USERS_SORT'
const APP_TABLES_SORT = 'APP_TABLES_SORT'
const APP_TABLES_QUERY = 'APP_TABLES_QUERY'

export const setUsersSort = createAction(APP_USERS_SORT)
export const setTablesSort = createAction(APP_TABLES_SORT)
export const setTablesQuery = createAction(APP_TABLES_QUERY)

const setUsersSortHandler = (state, action) => {
  const usersSort = action.payload
  const newState = immutable(state).set(['usersSort'], usersSort).value()
  return newState
}

const setTablesQueryHandler = (state, action) => {
  const tablesQuery = action.payload
  const newState = immutable(state).set(['tablesQuery'], tablesQuery).value()
  return newState
}

const setTablesSortHandler = (state, action) => {
  const tablesSort = action.payload
  const newState = immutable(state).set(['tablesSort'], tablesSort).value()
  return newState
}

const defaultState = {
  usersSort: '',
  tablesSort: '',
  tablesQuery: '',
}

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case APP_USERS_SORT:
      return setUsersSortHandler(state, action)
    case APP_TABLES_SORT:
      return setTablesSortHandler(state, action)
    case APP_TABLES_QUERY:
      return setTablesQueryHandler(state, action)
    default:
      return state
  }
}

export default appReducer
