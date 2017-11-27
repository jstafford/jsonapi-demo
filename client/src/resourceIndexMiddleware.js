import {indexRefresh} from './resourceIndexReducer'

const resourceIndexMiddleware = (store: Store<GenericMap, Action>)  =>
                        (next: (Action) => Action) =>
                        ( action: Action ): Action => {

  const nextAction = next(action)
  switch (action.type) {
    case 'API_HYDRATE':
    case 'API_CREATED':
    case 'API_READ':
    case 'API_UPDATED':
    case 'API_DELETED':
      const state = store.getState()
      store.dispatch(indexRefresh(state.api))
      break
    default:
      break
  }

  return nextAction
}

export default resourceIndexMiddleware
