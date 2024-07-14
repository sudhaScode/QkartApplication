import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Products from "./components/Products";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"
import { Switch, Route } from "react-router-dom";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/thanks" component={Thanks} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Products} />
      </Switch>
    </div>
  );
}

export default App;
