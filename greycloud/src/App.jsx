// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { layoutTypes } from "./constants/layout";

import {publicRoutes, authProtectedRoutes} from "./routes/allRoutes";

import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

import fakeBackend from "./helpers/AuthType/fakeBackend";
import AuthProtected from './routes/AuthProtected';
import { createSelector } from "reselect";

// Activating fake backend
fakeBackend();

const getLayout = (layoutType) => {
    let Layout = VerticalLayout;
    switch (layoutType) {
      case layoutTypes.VERTICAL:
        Layout = VerticalLayout;
        break;
      case layoutTypes.HORIZONTAL:
        Layout = HorizontalLayout;
        break;
      default:
        break;
    }
    return Layout;
  };

const Index = () => {
    const selectLayoutData = createSelector(
        (state) => state.Layout,
        (layoutType) => layoutType
    );
    const { layoutType } = useSelector(selectLayoutData);
    const Layout = getLayout(layoutType);
    return (
        <React.Fragment>
        <Routes>
            <Route>
                {publicRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <NonAuthLayout>
                                {route.component}
                            </NonAuthLayout>
                        }
                        key={idx}
                        exact={true}
                    />
                ))}
            </Route>

            <Route>
                {authProtectedRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <AuthProtected>
                                <Layout>{route.component}</Layout>
                            </AuthProtected>
                        }
                        key={idx}
                        exact={true}
                    />
                ))}
            </Route>
        </Routes>
    </React.Fragment>
    );
  };
  
  export default Index;
