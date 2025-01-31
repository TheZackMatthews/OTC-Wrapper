import React, { useState, useEffect } from "react";

const TimeClockEmbed = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.ontheclock.com/javascript/otcTimeClock.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const darkBlue = "#005699";
  const lightGray = "#777";

  return (
    <div
      id="otcPunchSiteContainer"
      style={{
        width: "90vw",
        maxWidth: "450px",
        backgroundColor: lightGray,
        border: "1px solid #ddd",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: '"Proxima Nova", sans-serif',
      }}
    >
      <div
        id="otcPunchSiteHead"
        style={{
          height: "100%",
          padding: "12px",
          textAlign: "center",
          backgroundColor: darkBlue,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Employee Time Clock
      </div>
      <div id="otcPunchSiteBody">
        <iframe
          title="Time-Clock-Punch"
          style={{ display: "block", borderRadius: "0 0 12px 12px" }}
          src={`https://www.ontheclock.com/time-clock?acctkey=${process.env.REACT_APP_OTC_ACCOUNT_KEY}`}
          frameBorder="0"
          height="625px"
          width="100%"
        />
      </div>
      <div
        id="otcPunchSiteFooter"
        style={{
          textAlign: "center",
          backgroundColor: "#f3f3f3",
          padding: "12px",
          fontSize: "16px",
          borderTop: "1px solid #ddd",
        }}
      >
        <a
          id="otcPunchSiteFooterLink"
          style={{
            color: darkBlue,
            fontWeight: "bold",
            textDecoration: "none",
          }}
          href="https://www.ontheclock.com"
        >
          Visit OnTheClock.com
        </a>
      </div>
    </div>
  );
};

const App = () => {
  const [localTime, setLocalTime] = useState("Loading...");
  const [timeZone, setTimeZone] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(timeZone);

        const timer = setInterval(() => {
          const options = {
            timeZone,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          };
          setLocalTime(new Date().toLocaleTimeString("en-US", options));
        }, 1000);

        return () => clearInterval(timer);
      },
      (error) => setError("Error retrieving location: " + error.message)
    );

    // Set formatted date
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now);
    setDate(formattedDate);
  }, []);

  return (
    <div
      className="App"
      style={{
        textAlign: "center",
        padding: "30px",
        backgroundColor: "#eef2f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px 0px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "90vw",
          maxWidth: "450px",
        }}
      >
        <p style={{ fontSize: "34px", fontWeight: "600", color: "#1a3d7f" }}>
          {localTime}
        </p>
        <p style={{ fontSize: "20px", fontWeight: "500", color: "black" }}>
          {date}
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Display the Time Clock Embed inline */}
      <TimeClockEmbed />
    </div>
  );
};

export default App;
