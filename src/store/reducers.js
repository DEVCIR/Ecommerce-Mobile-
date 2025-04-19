import { combineReducers } from "redux"
// import notificationReducer from "../notification/reducer";
import notificationReducer from "../../src/store/notification/reducer";
// Front
import Layout from "./layout/reducer"
import Breadcrumb from "./Breadcrumb/reducer";  

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"
//chat
import chat from "./chat/reducer";

//Calendar
import calendar from "./calendar/reducer"

//tasks
import tasks from "./tasks/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
   //Breadcrumb items
   Breadcrumb,
   Notification: notificationReducer,
  tasks, 
  Login,
  Account,
  ForgetPassword,
  Profile,
  calendar,
  chat,
})

export default rootReducer
