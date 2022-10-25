import { observable } from "mobx";
import { observer } from "mobx-react";
import "./register.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Login } from "../login/login";
import AuthService from "../../authService";

interface State {
  name: string;
  password: string;
  rePassword: string;
}

interface Submit {
  username: string;
  password: string;
}

class Store {
  @observable isLoading: boolean = false;
  @observable setLoading = (value: boolean) => {
    this.isLoading = true;
  };
  @observable submit = async (value: Submit) => {
    try {
      this.isLoading = true;
      AuthService.register(value.username, value.password);
    } catch (e) {
      console.error({ e });
      alert("Could not register");
    } finally {
      this.isLoading = false;
    }
  };
}

@observer
export class Register extends React.Component<{}, State> {
  state: State = {
    name: "",
    password: "",
    rePassword: "",
  };
  store = new Store();
  componentDidMount() {}

  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.password === this.state.rePassword) {
      this.store.submit({
        username: this.state.name,
        password: this.state.password,
      });
      window.location.href = "/";
    }
  };

  handleChangeName = (e: any) => {
    this.setState({ name: e.target.value });
  };

  handleChangePassword = (e: any) => {
    this.setState({ password: e.target.value });
  };

  handleChangeRePassword = (e: any) => {
    this.setState({ rePassword: e.target.value });
  };

  render() {
    console.log(this.state.password, this.state.rePassword);
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card">
              <h2 className="card-title text-center">Register</h2>
              <div className="card-body py-md-4">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      value={this.state.name}
                      className="form-control"
                      id="name"
                      placeholder="Name"
                      onChange={this.handleChangeName}
                    ></input>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      value={this.state.password}
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      onChange={this.handleChangePassword}
                    ></input>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      value={this.state.rePassword}
                      id="confirm-password"
                      placeholder="confirm-password"
                      onChange={this.handleChangeRePassword}
                    ></input>
                    {this.state.password !== this.state.rePassword && (
                      <div className="text-danger"> Passwords don't match</div>
                    )}
                  </div>
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <Link to="/login">Login</Link>
                    <button type="submit" className="btn btn-primary">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
