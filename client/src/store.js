import {combineReducers, createStore, applyMiddleware, compose} from 'redux'
import {reducer as api} from 'redux-json-api'
import reduxThunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reducers = combineReducers({
  api
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))

export default store
