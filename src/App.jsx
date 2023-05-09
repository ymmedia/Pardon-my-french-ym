import React from "react";
import { Switch, Route, Redirect } from "react-router";
import Intro from "./parts/intro";
import Module from "./parts/module";
import User from "./stores/UserStore";
import useSizes from "./hooks/useSizes";

import "./App.scss";

const checkData = () => {
  console.log("check data");
  let { lng } = User.getUser();
  console.log(lng);
  if (lng !== undefined) {
    return <Redirect to="/module" />;
  }
};
function App() {
  let useSize=useSizes()
  return (
    <main className={useSize.isVerySmall ?  "App app-small" : "App" }>
      {checkData()}
      <Switch>
        <Route
          key={1}
          exact
          path="/"
          render={(props) => (
            // eslint-disable-next-line react-hooks/rules-of-hooks
            <Intro useSize={useSize} />
          )}
        />
        <Route
          key={2}
          exact
          path="/module"
          render={(props) => (
            // eslint-disable-next-line react-hooks/rules-of-hooks
            <Module useSize={useSize} />
          )}
        />
      </Switch>
    </main>
  );
}

export default App;
