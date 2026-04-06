import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Accelerated Growth — B2B SaaS Outbound & Appointment Setting Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f1e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(51, 102, 255, 0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(51, 102, 255, 0.08)",
            filter: "blur(80px)",
          }}
        />

        {/* Top: Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "rgba(51,102,255,0.15)",
              border: "1px solid rgba(51,102,255,0.3)",
              borderRadius: "100px",
              padding: "6px 18px",
              color: "#99b3ff",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4ade80",
              }}
            />
            Now Booking Q2 2026
          </div>
        </div>

        {/* Middle: Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Predictable Pipeline
            <br />
            <span style={{ color: "#6699ff" }}>for B2B SaaS Companies.</span>
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#9ca3af",
              maxWidth: "700px",
              lineHeight: 1.5,
            }}
          >
            Done-for-you cold email, LinkedIn outreach, and appointment setting.
            20–50 qualified sales meetings per month — fully managed.
          </div>
        </div>

        {/* Bottom: Stats + Brand */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "40px" }}>
            {[
              { value: "20–50", label: "Meetings / Month" },
              { value: "8–15%", label: "Reply Rate Target" },
              { value: "2 Weeks", label: "To First Email" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              opacity: 0.9,
            }}
          >
            acceleratedgrowth.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
