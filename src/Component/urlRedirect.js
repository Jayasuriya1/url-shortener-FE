import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { API_URL } from "../config";

export default function UrlRedirect() {
  const { shortUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await fetch(
          `${API_URL}/shortURL/data`
        );
        const urlData = await response.json();
        if (urlData.success === true && Array.isArray(urlData.data)) {
          const filterData = urlData.data.find((data) => {
            return data.shortUrl === shortUrl;
          });
          if (filterData) {
            fetch(
              `${API_URL}/shortURL/update/clickcount/${shortUrl}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            ).catch((err) => console.log(err));

            window.location.replace(filterData.longUrl);
          } else {
            navigate("/nopage");
          }
        } else {
          navigate("/nopage");
        }
      } catch (error) {
        console.log(error);
        navigate("/nopage");
      }
    };
    redirect();
  }, [shortUrl, navigate]);

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center flex-column gap-3">
      <Spinner animation="border" variant="primary" />
      <p className="text-muted fw-semibold">Redirecting to destination...</p>
    </div>
  );
}

