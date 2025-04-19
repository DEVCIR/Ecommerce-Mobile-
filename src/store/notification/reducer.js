import { SET_NOTIFICATIONS } from './actions';

const initialState = {
  notifications: {}
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      };
    default:
      return state;
  }
};

export default notificationReducer;