// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./i18n";
import store from "./store";

if (document.getElementById('root')) {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
        <Provider store={store}>
            <React.Fragment>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.Fragment>
        </Provider>
    );
}
