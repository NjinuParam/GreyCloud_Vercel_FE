import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, logoutUserSuccess } from "./actions";

//Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function* loginUser({ payload: { user, history } }) {
  try {

    const logged_users = {
      login: true,
      user_id: "12345",
      name: "Harps",
      email: "mohumutsi@webparam.org",
    };

    sessionStorage.setItem('authUser', JSON.stringify(logged_users));
    yield put(logoutUserSuccess(logged_users));
    yield new Promise((resolve) => {
      toast.success("User Login Successfully", {
        position: "top-right",
        autoClose: 3000,
        onClose: resolve, // Resolve the Promise when the toast is closed
      });
    });
    history('/dashboard');

    // eslint-disable-next-line no-unused-vars
    const response = yield axios.post('/api/login', user);
    //const data = response.data;
    // if (data.success === true && data.message === 'success') {
    //   const logged_user = {
    //     login: true,
    //     user_id: data.data.id,
    //     name: data.data.name,
    //     email: data.data.email,
    //   };
    //   sessionStorage.setItem('authUser', JSON.stringify(logged_user));
    //   yield put(logoutUserSuccess(logged_user));
    //   yield new Promise((resolve) => {
    //     toast.success("User Login Successfully", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       onClose: resolve, // Resolve the Promise when the toast is closed
    //     });
    //   });
    //   history('/dashboard');
    // } else {
    //   if (data.data === 400) {
    //     toast.error(data.message, {
    //       position: "top-right",
    //       autoClose: 3000,
    //     });
    //   }
    // }
  
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    sessionStorage.removeItem("authUser");
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
