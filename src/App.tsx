import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./pages/register/register";
import { Login } from "./pages/login/login";
import { Home } from "./pages/home/home";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import React from "react";
import { action, observable } from "mobx";
import AuthService, { User } from "./authService";
import EventBus from "./common/EventBus";
import { Container, Navbar } from "react-bootstrap";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined as User | undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };
  return (
    <BrowserRouter>
      <div>
        {currentUser && (
          <Navbar>
            <Container>
              <Navbar.Brand>Welcome {currentUser.username as any}</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text onClick={logOut}>Logout</Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}
        <div className="container mt-3">
          <Routes>
            {currentUser ? (
              <Route path="/" element={<Home />} />
            ) : (
              <Route path="/" element={<Login />} />
            )}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
