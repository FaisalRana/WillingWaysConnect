import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
function App() {
  return (
    <div>
      <Routes>
        <Route element={<LoggedInRoutes />}>
          {/* Thid is a protected route.  Profile and home are nested within loggedinroutes.  Loggedinroutes checks if a user is logged in.  If the user is logged in then it returns the outlet which allows for the child routes to render.  if no user exists it renders the login page instead.
           */}
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/" element={<Home />} exact />
        </Route>
          {/* When a user tries to access /login.  not logged in routes does a check to see if the user is logged in or not.  only if the user is not logged in does it allow the login page. 
           */}
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
