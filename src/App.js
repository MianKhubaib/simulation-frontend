import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ViewAll from "./ViewAll";
import Login from "./Login";
import { isExpired } from "./util";
import "tachyons";

function App() {
  const RequireAuth = ({ children }) => {
    let auth = isExpired();
    let location = useLocation();
    if (auth) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return (
        <Navigate
          to="/container-tracking-frontend/"
          state={{ from: location }}
          replace
        />
      );
    } else {
      return children;
    }
  };
  return (
    <div className="center">
      <h1 className="w-30 f4 link ph3 pv2 bg-light-blue tc center">
        Asset Tracking Project Simuation
      </h1>
      <Routes>
        <Route path="/container-tracking-frontend/" element={<Login />} />
        <Route
          path="/view"
          element={
            <RequireAuth>
              <ViewAll />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
