import React, { useEffect, useState } from "react";
import BaseApp from "../BaseApp/baseApp";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import LinkIcon from "@mui/icons-material/Link";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AppState } from "../Context/AppProvider";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL, FRONTEND_URL } from "../config";

export default function UrlList() {
  const { url, setUrl } = AppState();
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");
  const [title, setTitle] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urlId, setUrlId] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const logout = () => {
    localStorage.removeItem("clintId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  const edit = (Data) => {
    setTitle(Data.title);
    setLongUrl(Data.longUrl);
    setShortUrl(Data.shortUrl);
    setUrlId(Data._id);
    handleClickOpen();
  };

  const getData = async () => {
    try {
      const id = localStorage.getItem("clintId");
      const token = localStorage.getItem("authToken");
      if (!token || !id) {
        logout();
        return;
      }
      const response = await fetch(
        `${API_URL}/shortURL/data/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUrl(data.data || []);

      if (data.success === false) {
        toast.error(data.message || "Failed to load URLs");
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      logout();
    } else {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const update = async () => {
    const token = localStorage.getItem("authToken");
    const data = {
      title,
      longUrl,
    };
    try {
      const response = await fetch(
        `${API_URL}/shortURL/update/${urlId}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success === false) {
        toast.error(result.message || "Failed to update URL");
      } else {
        toast.success("URL updated successfully");
      }
    } catch (err) {
      console.log(err);
    }
    handleClose();
    getData();
  };

  const deleteUrl = async (id) => {
    const token = localStorage.getItem("authToken");
    if (url && Array.isArray(url)) {
      const filterData = url.filter((data) => data._id !== id);
      setUrl(filterData);
    }
    try {
      const response = await fetch(
        `${API_URL}/shortURL/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success === false) {
        toast.error(result.message || "Failed to delete URL");
      } else {
        toast.success("URL deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
    getData();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <BaseApp>
      <div className="url-list-container">
        <Container>
          {(!url || url.length === 0) ? (
            <h3 className="text-center pt-4 text-muted">No URLs Created Yet</h3>
          ) : null}
          {url &&
            Array.isArray(url) &&
            url.map((data, index) => {
              const fullShortUrl = `${FRONTEND_URL}/${data.shortUrl}`;
              return (
                <Row key={data._id || index} className="justify-content-center">
                  <Col xs={12} lg={10}>
                    <div className="urlList">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <h3 className="m-0 fw-bold fs-4">{data.title}</h3>
                        <div className="d-flex gap-2">
                          <button
                            style={{ backgroundColor: "#dc3545" }}
                            className="edit-btn"
                            onClick={() => deleteUrl(data._id)}
                          >
                            <DeleteIcon fontSize="small" /> Delete
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => edit(data)}
                          >
                            <ModeEditIcon fontSize="small" /> Edit
                          </button>
                        </div>
                      </div>
                      <div className="mb-2 text-break">
                        <a
                          style={{ color: "#011746", textDecoration: "none" }}
                          href={data.longUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <SubdirectoryArrowRightIcon fontSize="small" /> {data.longUrl}
                        </a>
                      </div>
                      <div className="d-flex flex-wrap align-items-center gap-3 text-secondary fs-6">
                        <span className="m-0">
                          Created On: {formatDate(data.createdAt || data.createdOn || data.date)}
                        </span>
                        <a
                          style={{ color: "#011746", textDecoration: "none" }}
                          href={fullShortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-break"
                        >
                          <LinkIcon fontSize="small" /> {fullShortUrl}
                        </a>
                        <span>
                          <VisibilityIcon fontSize="small" /> {data.clickCount || 0} clicks
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              );
            })}
        </Container>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Edit Short URL</DialogTitle>
        <DialogContent>
          <Form.Group className="mb-3 mt-2" controlId="formGroupEditLongUrl">
            <Form.Label style={{ fontWeight: "600" }}>
              Destination URL
            </Form.Label>
            <Form.Control
              type="url"
              required
              placeholder="https://example.com/my-long-url"
              name="longUrl"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupEditTitle">
            <Form.Label style={{ fontWeight: "600" }}>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              required
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 mt-3" controlId="formGroupEditShortUrl">
            <Form.Label style={{ fontWeight: "600" }}>Short URL Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Short Url"
              disabled
              name="shortUrl"
              value={shortUrl}
            />
          </Form.Group>
          <button type="submit" onClick={() => update()} className="create-btn mt-2">
            SAVE CHANGES
          </button>
        </DialogContent>
      </Dialog>
    </BaseApp>
  );
}

