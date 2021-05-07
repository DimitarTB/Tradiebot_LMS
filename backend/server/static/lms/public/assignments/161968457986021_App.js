import logo from './logo.svg';
import Login from "./Components/Authenticate/Login"
import NavMenu from "./Components/Header"
import Home from "./Components/Home"
import Logout from "./Components/Authenticate/Logout"
import Register from "./Components/Authenticate/Register"
import CreatePost from "./Components/CreatePost"
import Post from "./Components/Post"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { useEffect, useState } from 'react';

import Test from "./Components/Test"

// function App() {
//   const url = `http://127.0.0.1:5000/user/current`;
//   const [user, setUser] = useState({
//     loading: false,
//     data: null,
//     error: false
//   });
//     axios.get(url)
//       .then(response => {
//         setUser({
//           loading: false,
//           data: response.data,
//           error: false
//         })
//       })
//   }, [url]);

//   if (user.loading) {
//     content = <div className="flex justify-center"><div className="loader">Loading...</div></div>
//   }
//   return (
//     <NavMenu />
//   );
// }

// export default App;



const App = props => {

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(localStorage.getItem("currentUser"))
  }, [currentUser])

  return (
    <div className="App">

      <Router>
        <NavMenu currentUser={currentUser} />
        <Switch>
          <Route exact path="/test" component={Test} />

          <Route exact path="/createPost">
            <CreatePost currentUser={currentUser} />
          </Route>
          <Route exact path="/post/:id" component={Post} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/login">
            <Login setCurrentUser={setCurrentUser} currentUser={currentUser} />
          </Route>
          <Route exact path="/register">
            <Register setCurrentUser={setCurrentUser} />
          </Route>
          {currentUser !== null ? (<Route path="/home" component={() => { return "Home" }} />) : <Redirect to="/login" />}
          <Route exact path="/logout">
            <Logout setCurrentUser={setCurrentUser} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App