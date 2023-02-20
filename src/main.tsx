import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "./routes/Error404";
import Home from "./routes/Home";
import DetailsJoyplot from "./routes/DetailsJoyplot";
import DetailsTreemap from "./routes/DetailsTreemap";
import About from "./routes/About";
import DetailsBarplot from "./routes/DetailsBarplot";
import Map from "./routes/Map";
import DetailsCircular from "./routes/DetailsCircular";
import CircularPacking from "./routes/CircularPacking";
import Joyplot from "./routes/Joyplot";
import Treemap from "./routes/Treemap";
import langData from "@src/app/lang"
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import { createI18n, I18nProvider, useI18n } from "react-simple-i18n";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error404 />,
    children: [
      {
        path: "joyplot/",
        element: <Joyplot />,
        errorElement: <Error404 />,
        children: [
          {
            path: "details/:name/:date/:byParty",
            element: <DetailsJoyplot />,
          },
        ],
      },
      {
        path: "square/",
        element: <Treemap />,
        children: [
          {
            path: "details/:description/:startDate/:endDate",
            element: <DetailsTreemap />,
            children: [
              {
                path: ":name",
                element: <DetailsBarplot />,
              },
            ],
          },
        ],
      },
      {
        path: "circular_packing/",
        element: <CircularPacking />,
        errorElement: <Error404 />,
        children: [
          {
            path: ":name/:startDate/:endDate",
            element: <DetailsCircular />,
          },
        ],
      },
      {
        path: "map/",
        element: <Map />,
        errorElement: <Error404 />,
        children: [],
      },
    ],
  },
  {
    path: "/about",
    element: <About />,
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nProvider i18n={createI18n(langData, { lang: "enUS" })}>
        <RouterProvider router={router} />
      </I18nProvider>
    </Provider>
  </React.StrictMode>
);
