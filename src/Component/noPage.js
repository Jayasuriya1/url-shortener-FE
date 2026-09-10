import React from "react";
import "boxicons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function NoPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");

  return (
    <div className="main-container">
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }} className="d-flex align-items-center gap-2">
            <box-icon name="chart" type="solid" color="#1462fe"></box-icon>
            <span className="text-white fw-bold">URL Shortener</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isLoggedIn ? (
                <Nav.Link href="#" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link href="#" onClick={() => navigate("/login")}>
                    Log In
                  </Nav.Link>
                  <Nav.Link href="#" onClick={() => navigate("/register")}>
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content d-flex flex-column justify-content-center align-items-center text-center p-4">
        <h1 className="display-4 fw-bold text-dark">404 - Page Not Found</h1>
        <p className="lead mt-3 text-secondary" style={{ maxWidth: "500px" }}>
          Something's wrong here. The link you clicked or URL you entered does not exist or has been removed.
        </p>
        <Button
          variant="primary"
          className="mt-3 px-4 py-2 fw-semibold"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
        >
          {isLoggedIn ? "Go to Dashboard" : "Go to Login"}
        </Button>
      </div>
    </div>
  );
}

