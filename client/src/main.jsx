/*
|--------------------------------------------------------------------------
| File : main.jsx
|--------------------------------------------------------------------------
|
| Purpose
| -------
| Entry point of the React application.
|
|--------------------------------------------------------------------------
*/

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);