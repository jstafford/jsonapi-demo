import {createAction} from 'redux-actions'
import immutable from 'object-path-immutable'

const APP_USERS_SORT = 'APP_USERS_SORT'
const APP_TABLES_SORT = 'APP_TABLES_SORT'
const APP_TABLES_QUERY = 'APP_TABLES_QUERY'
const APP_ADD_TABLES_TAGS = 'APP_ADD_TABLES_TAGS'
const APP_REMOVE_TABLES_TAGS = 'APP_REMOVE_TABLES_TAGS'
const APP_TABLES_FOCUS = 'APP_TABLES_FOCUS'

export const setUsersSort = createAction(APP_USERS_SORT)
export const setTablesSort = createAction(APP_TABLES_SORT)
export const setTablesQuery = createAction(APP_TABLES_QUERY)
export const addTablesTags = createAction(APP_ADD_TABLES_TAGS)
export const removeTablesTags = createAction(APP_REMOVE_TABLES_TAGS)
export const setTablesFocus = createAction(APP_TABLES_FOCUS)

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

const addTablesTagsHandler = (state, action) => {
  const tablesTag = action.payload
  if (state.tablesTags.indexOf(tablesTag) < 0) {
    const newState = immutable(state).push(['tablesTags'], tablesTag).value()
    return newState
  }
  return state
}

const removeTablesTagsHandler = (state, action) => {
  const tablesTag = action.payload
  const index = state.tablesTags.indexOf(tablesTag)
  if (index >= 0) {
    const newState = immutable(state).del(['tablesTags', index]).value()
    return newState
  }
  return state
}

const setTablesFocusHandler = (state, action) => {
  const tablesFocus = action.payload
  const newState = immutable(state).set(['tablesFocus'], tablesFocus).value()
  return newState
}

const defaultState = {
  usersSort: '',
  tablesFocus: '',
  tablesSort: '',
  tablesQuery: '',
  tablesTags: [],
}

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case APP_USERS_SORT:
      return setUsersSortHandler(state, action)
    case APP_TABLES_FOCUS:
      return setTablesFocusHandler(state, action)
    case APP_TABLES_SORT:
      return setTablesSortHandler(state, action)
    case APP_TABLES_QUERY:
      return setTablesQueryHandler(state, action)
    case APP_ADD_TABLES_TAGS:
      return addTablesTagsHandler(state, action)
    case APP_REMOVE_TABLES_TAGS:
      return removeTablesTagsHandler(state, action)
    default:
      return state
  }
}

export default appReducer
