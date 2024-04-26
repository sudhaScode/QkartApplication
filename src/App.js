import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Products from "./components/Products";
import Login from "./components/Login";
import { Switch, Route } from "react-router-dom";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8083/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Products} />
      </Switch>
    </div>
  );
}

export default App;
/**
 <Routes>
          <Route path="/" element={<Products/>}/>
          <Route path="/login" element={<Login/>}/>
            <Route path="/register"   element={<Register/>} />
        </Routes>
        Subject
Routing is not working even though routes defined

Description
Wrapped the react application with BrowserRouter  and defined the routes in src/App.js only root path is getting navigating for all defined routes.
 */
