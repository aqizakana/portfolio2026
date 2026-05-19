import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a1a",
        color: "#e0e0e0",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Web City</h1>
      <p style={{ marginBottom: "2rem", color: "#888" }}>
        作品が存在する都市
      </p>
      <Link
        to="/works"
        style={{
          padding: "0.75rem 2rem",
          border: "1px solid #444",
          color: "#e0e0e0",
          textDecoration: "none",
          transition: "border-color 0.2s",
        }}
      >
        Enter City →
      </Link>
    </div>
  );
}
