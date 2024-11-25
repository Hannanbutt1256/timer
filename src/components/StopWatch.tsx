import React, { useState, useEffect } from "react";

// Define what our time object looks like
interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

const StopWatch = () => {
  // Basic states for our timer
  const [time, setTime] = useState<Time>({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<string>("");
  const [tempInputTime, setTempInputTime] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);

  // Helper function to add leading zero to numbers less than 10
  const addLeadingZero = (num: number) => {
    return num < 10 ? `0${num}` : num.toString();
  };

  // Simple function to convert total seconds into hours, minutes, and seconds
  const convertSecondsToTime = (totalSeconds: number): Time => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  // Timer effect - updates every second when running
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (isRunning) {
      timerInterval = setInterval(() => {
        setTime((currentTime) => {
          // Convert current time to total seconds and add 1
          const totalSeconds =
            currentTime.hours * 3600 +
            currentTime.minutes * 60 +
            currentTime.seconds +
            1;

          // Convert back to hours, minutes, seconds
          return convertSecondsToTime(totalSeconds);
        });
      }, 1000);
    }

    // Cleanup interval when component unmounts or timer stops
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isRunning]);

  // Handle input time change
  const handleTempInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempInputTime(e.target.value);
  };

  // Handle setting the input time
  const handleSetInputTime = () => {
    // Basic validation for time format (HH:MM:SS)
    const timePattern = /^\d{1,2}:\d{2}:\d{2}$/;
    if (!timePattern.test(tempInputTime)) {
      alert("Please enter time in format HH:MM:SS");
      return;
    }
    setInputTime(tempInputTime);
  };

  // Start the timer
  const handleStart = () => {
    const currentTime = new Date();
    setStartTime(currentTime.getTime());
    setIsRunning(true);
  };

  // Stop the timer
  const handleStop = () => {
    setIsRunning(false);
  };

  // Reset everything
  const handleReset = () => {
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setInputTime("");
    setTempInputTime("");
    setStartTime(null);
    setIsRunning(false);
  };

  // Effect to handle input time calculations
  useEffect(() => {
    if (!startTime || !inputTime) return;

    // Split input time into hours, minutes, seconds
    const [hours = 0, minutes = 0, seconds = 0] = inputTime
      .split(":")
      .map((num) => parseInt(num, 10));

    // Get current date and create timestamp for input time
    const currentDate = new Date();
    const inputDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes,
      seconds
    );

    // Calculate how much time has passed
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);

    // Calculate difference between input time and start time
    let timeDifference = Math.floor((inputDate.getTime() - startTime) / 1000);

    // If input time is in the future, assume it's from previous day
    if (timeDifference > elapsedSeconds) {
      inputDate.setDate(inputDate.getDate() - 1);
      timeDifference = Math.floor((inputDate.getTime() - startTime) / 1000);
    }

    // Calculate final time
    const finalSeconds =
      timeDifference < 0
        ? elapsedSeconds + Math.abs(timeDifference)
        : elapsedSeconds - timeDifference;

    // Update the timer
    setTime(convertSecondsToTime(finalSeconds));
  }, [inputTime, startTime]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Timer</h1>

      {/* Timer Display */}
      <div
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#4A90E2",
        }}
      >
        {addLeadingZero(time.hours)}:{addLeadingZero(time.minutes)}:
        {addLeadingZero(time.seconds)}
      </div>

      {/* Controls */}
      <div>
        {/* Time Input */}
        <input
          type="text"
          placeholder="HH:MM:SS"
          value={tempInputTime}
          onChange={handleTempInputChange}
          disabled={!isRunning}
          style={{
            padding: "5px",
            width: "120px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        />

        {/* Buttons */}
        <button
          onClick={handleSetInputTime}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#FFA500",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Set Time
        </button>
        <button
          onClick={handleStart}
          disabled={isRunning}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#4A90E2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: isRunning ? "#FF6F61" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning ? "pointer" : "not-allowed",
          }}
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2ECC71",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default StopWatch;
