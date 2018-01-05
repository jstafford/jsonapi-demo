import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import {reducer as api, setAxiosConfig} from './jsonapi-client-redux'
import reduxThunk from 'redux-thunk'
import app from './appreducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducers = combineReducers({
  api,
  app,
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))

store.dispatch(setAxiosConfig({baseURL: 'http://localhost:8443/jsonapi/'}))

export default store
