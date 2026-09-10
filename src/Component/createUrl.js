import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import BaseApp from "../BaseApp/baseApp";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { AppState } from "../Context/AppProvider";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const urlSchemaValidation = yup.object({
  longUrl: yup
    .string()
    .url("Must be a valid URL starting with http:// or https://")
    .required(`We'll need a valid URL, like "https://yourbrand.co/niceurl"`),
  title: yup
    .string()
    .required("Title is Required")
    .min(4, "Title cannot be less than 4 characters"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateUrl() {
  const { setUrl } = AppState();
  const navigate = useNavigate();
  const userId = localStorage.getItem("clintId");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("clintId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const getData = async () => {
    try {
      const id = localStorage.getItem("clintId");
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/shortURL/data/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await response.json();
      setUrl(data.data || []);

      if (data.success === false) {
        toast.error(data.message);
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        longUrl: "",
        title: "",
      },
      validationSchema: urlSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          setLoading(true);

          const response = await fetch(
            `${API_URL}/shortURL/create/${userId}`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const result = await response.json();
          if (result.success === true) {
            resetForm();
            handleClick();
            getData();
          } else {
            toast.error(result.message || "Failed to create short URL");
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
    <BaseApp>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <form onSubmit={handleSubmit}>
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} className="pt-2">
              <h3 style={{ fontWeight: "800" }}>Create new URL</h3>
              <Form.Group className="mb-3 mt-3" controlId="formGroupLongUrl">
                <Form.Label style={{ fontWeight: "600" }}>
                  Destination URL
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/my-long-url"
                  name="longUrl"
                  value={values.longUrl}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.longUrl && errors.longUrl ? (
                  <p style={{ color: "crimson", fontSize: "0.875rem" }}>{errors.longUrl}</p>
                ) : (
                  ""
                )}
              </Form.Group>

              <Form.Group className="mb-3 mt-3" controlId="formGroupTitle">
                <Form.Label style={{ fontWeight: "600" }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.title && errors.title ? (
                  <p style={{ color: "crimson", fontSize: "0.875rem" }}>{errors.title}</p>
                ) : (
                  ""
                )}
              </Form.Group>
              <button type="submit" className="create-btn mt-2">
                Create Short URL
              </button>
            </Col>
          </Row>
        </Container>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Short URL Created Successfully!
        </Alert>
      </Snackbar>
    </BaseApp>
  );
}

