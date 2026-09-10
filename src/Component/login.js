import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { API_URL } from "../config";

const userSchemaValidation = yup.object({
  email: yup.string().email().required("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is Required")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          setLoading(true);
          localStorage.removeItem("clintId");
          localStorage.removeItem("authToken");
          const response = await fetch(
            `${API_URL}/user/login`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (
            result.success === false &&
            result.message ===
              "Please Verify The Email. Verification Link Send To Your Mail Successfully"
          ) {
            handleClickOpen();
          } else if (result.success === true) {
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("clintId", result.id);
            navigate("/dashboard");
          } else {
            toast.error(result.message || "Login failed");
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
      },
    });
  return (
    <Container fluid className="login-container">
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <div className="d-flex justify-content-between">
        <span className="d-flex align-items-center">
          <h1
            style={{
              fontWeight: "900",
              paddingLeft: "20px",
              paddingTop: "10px",
            }}
          >
            URL Shortener
          </h1>
        </span>
      </div>
      <Row className="mt-4 justify-content-around align-items-center px-3">
        <Col className="login-content mb-4 mb-md-0" md={5} lg={5}>
          <h1>
            THE IDEA IS TO MINIMIZE THE WEB PAGE ADDRESS INTO SOMETHING THAT'S
            EASIER TO REMEMBER AND TRACK.
          </h1>
        </Col>
        <Col md={5} lg={4}>
          <h3 style={{ fontWeight: "400" }} className="mb-3">Sign in</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            {touched.email && errors.email ? (
              <p style={{ color: "#ffcbd1", fontSize: "0.875rem" }}>{errors.email}</p>
            ) : (
              ""
            )}
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            {touched.password && errors.password ? (
              <p style={{ color: "#ffcbd1", fontSize: "0.875rem" }}>{errors.password}</p>
            ) : (
              ""
            )}
            <Button className="w-100 mt-2" variant="danger" type="submit">
              Next
            </Button>
          </Form>
          <p className="text-center mt-3">
            Forgot{" "}
            <Link style={{ color: "#ffffff" }} to={"/forgotPassword"}>
              password?
            </Link>
          </p>
          <div className="text-center">
            Not registered yet?{" "}
            <Link style={{ color: "#ffffff" }} to={"/register"}>
              Sign Up
            </Link>
          </div>
        </Col>
      </Row>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"A verification link has been sent to your email account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please click on the link that has just been sent to your email
            account to verify your email and continue the registration process.
            {" Note: "} Link valid for 15 minutes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

