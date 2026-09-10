import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { API_URL } from "../config";

export default function EmailVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(
          `${API_URL}/user/email/verification/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.success === true) {
          toast.success(result.message || "Email verified successfully!");
          navigate("/login");
        } else {
          toast.error(result.message || "URL Expired or Invalid");
        }
      } catch (error) {
        console.log(error);
        toast.error("Verification failed");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [id, navigate]);

  if (loading === true) {
    return (
      <div className="d-flex w-100 vh-100 justify-content-center align-items-center gap-2">
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column w-100 vh-100 justify-content-center align-items-center text-center p-3">
      <h1 className="fw-bold mb-3">Verification Failed or Expired</h1>
      <p className="text-muted">The verification link is either invalid or has expired.</p>
      <button className="create-btn mt-3" style={{ maxWidth: "200px" }} onClick={() => navigate("/login")}>
        Back to Login
      </button>
    </div>
  );
}

