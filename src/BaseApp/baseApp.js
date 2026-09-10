import React from "react";
import "boxicons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

export default function BaseApp({ children }) {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("clintId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  return (
    <div className="main-container">
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }} className="d-flex align-items-center gap-2">
            <box-icon name="chart" type="solid" color="#1462fe"></box-icon>
            <span className="text-white fw-bold">URL Shortener</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/dashboard")}>
                Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/create")}>
                Create URL
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/link/details")}>
                View URL List
              </Nav.Link>
              <Nav.Link onClick={() => logOut()} className="text-danger">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content">{children}</div>
    </div>
  );
}

