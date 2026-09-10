import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { API_URL } from "../config";

const userSchemaValidation = yup.object({
  password: yup
    .string()
    .required("Password is Required")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [loading, setLoading] = useState(false);

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data, { resetForm }) => { 
        try {
          setLoading(true);
          const response = await fetch(
            `${API_URL}/user/reset-password/${id}/${token}`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            } 
          );
          const result = await response.json();
          if (result.success === true) {
            toast.success(result.message || "Password reset successful");
            navigate("/login");
          } else {
            toast.error(result.message || "Failed to reset password");
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
          <LinearProgress color="success" />
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
          <h3 style={{ fontWeight: "400" }} className="mb-3">
            Reset Your Password
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                placeholder="Enter new password"
              />
            </Form.Group>
            {touched.password && errors.password ? (
              <p style={{ color: "#ffcbd1", fontSize: "0.875rem" }}>{errors.password}</p>
            ) : (
              ""
            )}
            <Button className="w-100 mt-2" variant="danger" type="submit">
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

