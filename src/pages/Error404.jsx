import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top left, rgba(255, 184, 77, 0.26), transparent 32%), linear-gradient(135deg, #f7f1e3 0%, #fffaf1 46%, #f3ede1 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          borderRadius: "28px",
          overflow: "hidden",
          background: "#fffdf8",
          boxShadow: "0 24px 70px rgba(69, 45, 16, 0.14)",
          border: "1px solid rgba(126, 92, 36, 0.12)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
        }}
      >
        <div style={{ padding: "3.5rem 3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              background: "#fef0cf",
              color: "#996515",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Route Not Found
          </div>
          <h1
            style={{
              margin: "1.2rem 0 0.8rem",
              fontSize: "clamp(3.4rem, 8vw, 6rem)",
              lineHeight: 0.92,
              color: "#2d2416",
              fontWeight: 800,
            }}
          >
            404
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "1.15rem",
              color: "#5d503d",
              maxWidth: "32rem",
            }}
          >
            The page you requested does not exist, may have been moved, or the
            address is incomplete.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.9rem",
              marginTop: "2rem",
            }}
          >
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "170px",
                padding: "0.95rem 1.35rem",
                borderRadius: "14px",
                background: "#c97216",
                color: "#fffaf2",
                fontWeight: 700,
                boxShadow: "0 14px 30px rgba(201, 114, 22, 0.22)",
              }}
            >
              Back to Dashboard
            </Link>
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "150px",
                padding: "0.95rem 1.35rem",
                borderRadius: "14px",
                background: "transparent",
                color: "#725222",
                fontWeight: 700,
                border: "1px solid rgba(114, 82, 34, 0.2)",
              }}
            >
              Go to Login
            </Link>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            padding: "2.5rem",
            background:
              "linear-gradient(180deg, rgba(255, 214, 140, 0.42) 0%, rgba(245, 189, 92, 0.18) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.38)",
              filter: "blur(2px)",
            }}
          />
          <div
            style={{
              width: "100%",
              maxWidth: "280px",
              aspectRatio: "1 / 1",
              borderRadius: "28px",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,244,218,0.86))",
              border: "1px solid rgba(162, 121, 48, 0.2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <div style={{ textAlign: "center", color: "#7b5518" }}>
              <div
                style={{
                  fontSize: "5rem",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.08em",
                }}
              >
                /?
              </div>
              <div
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.95rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Check the URL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error404;
