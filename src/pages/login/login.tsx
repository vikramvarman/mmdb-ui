import { action, observable } from "mobx";
import { observer } from "mobx-react";
import "../register/register.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface State {
  name: string;
  password: string;
  rePassword: string;
  isPasswordErrors: boolean;
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
  @action
  submit = async (value: Submit) => {
    try {
      this.isLoading = true;
      const response = await axios.post(
        "http://localhost:8001/api/user/login",
        value
      );

      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.accessToken)
        );
      }
    } catch (e) {
      console.error({ e });
      alert("Could not register");
    } finally {
      this.isLoading = false;
    }
  };
}

@observer
export class Login extends React.Component<{}, State> {
  state: State = {
    name: "",
    password: "",
    rePassword: "",
    isPasswordErrors: false,
  };
  store = new Store();
  componentDidMount() {}

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.store.submit({
      username: this.state.name,
      password: this.state.password,
    });
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
    console.log(this.state.isPasswordErrors);
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card">
              <h2 className="card-title text-center">Login</h2>
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
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <Link to="/register">Register</Link>
                    <button type="submit" className="btn btn-primary">
                      Login
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
