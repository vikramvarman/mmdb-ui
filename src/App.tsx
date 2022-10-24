import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./pages/register/register";
import { Login } from "./pages/login/login";
import { Home } from "./pages/home/home";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import React from "react";
import { action, observable } from "mobx";

class Store {
  @observable user: {
    id: string;
    username: string;
    accessToken: "string";
  } | null = null;

  @observable isAuthorized: boolean = false;

  @action.bound
  checkAuth = () => {
    const userData = JSON.parse(localStorage.getItem("user")!);
    if (!userData) {
      this.isAuthorized = false;
      return;
    }

    this.user = userData;
    this.isAuthorized = true;
  };
}
@observer
export class App extends React.Component<any, any> {
  store = new Store();

  componentDidMount() {
    this.store.checkAuth();
  }

  render() {
    console.log(this.store.user, this.store.isAuthorized);
    return (
      <BrowserRouter>
        <Routes>
          {this.store.isAuthorized ? (
            <Route path="/" element={<Home user={this.store.user!} />} />
          ) : (
            <Route path="/" element={<Login />} />
          )}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
