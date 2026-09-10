import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BaseApp from "../BaseApp/baseApp";
import { AppState } from "../Context/AppProvider";
import { API_URL } from "../config";

export default function Dashboard() {
  const { url, setUrl, userData, setUserData } = AppState();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("clintId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      logout();
    } else {
      const getData = async () => {
        try {
          const id = localStorage.getItem("clintId");
          const token = localStorage.getItem("authToken");
          const response = await fetch(
            `${API_URL}/shortURL/data/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          setUrl(data.data || []);
          const response2 = await fetch(
            `${API_URL}/user/profile/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data2 = await response2.json(); 
          setUserData(data2.data);

          if (data.success === false) {
            logout();
          }
          if (data2.success === false) {
            logout();
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  let totalClickCount = 0;
  if (Array.isArray(url)) {
    for (let i = 0; i < url.length; i++) {
      totalClickCount += Number(url[i].clickCount || 0);
    }
  }

  return (
    <BaseApp>
      <h1 className="text-center pt-4 fw-bold">
        Welcome {userData != null ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim() : ""}
      </h1>
      <Container className="py-4">
        <Row className="justify-content-center gap-4 mt-3">
          <Col
            xs={11}
            sm={8}
            md={5}
            lg={4}
            style={{ backgroundColor: "#007c8c" }}
            className="dashboard p-0"
          >
            <div className="border-bottom border-light">
              <h3 className="text-center pt-3 pb-2 fs-4 fw-semibold">Total Clicks</h3>
            </div>
            <div className="text-center p-3 fs-2 fw-bold">
              <p className="m-0">{totalClickCount}</p>
            </div>
          </Col>
          <Col
            xs={11}
            sm={8}
            md={5}
            lg={4}
            className="dashboard p-0"
          >
            <div className="border-bottom border-light">
              <h3 className="text-center pt-3 pb-2 fs-4 fw-semibold">Total Short URLs</h3>
            </div>
            <div className="text-center p-3 fs-2 fw-bold">
              <p className="m-0">{Array.isArray(url) ? url.length : 0}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </BaseApp>
  );
}

