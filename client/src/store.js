import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import {reducer as api, setAxiosConfig} from 'redux-json-api'
import reduxThunk from 'redux-thunk'
import resourceIndex from './resourceIndexReducer'
import resourceIndexMiddleware from './resourceIndexMiddleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducers = combineReducers({
  api,
  resourceIndex,
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk, resourceIndexMiddleware)))

store.dispatch(setAxiosConfig({baseURL: 'http://localhost:8443/jsonapi/'}))

export default store
