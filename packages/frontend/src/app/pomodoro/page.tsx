"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Copyright from "@/components/Copyright";
import Paper from "@mui/material/Paper";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import React from "react";
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import defaultConfig, { type DefaultConfig } from "@/lib/defaultConfig";
import { useConfigContext } from "@/context/ConfigContext";
import { formatTime } from "@/lib/time";
import {
  usePomodorosContext,
  usePomodorosDispatch,
  type IPomodoro,
} from "@/context/PomodorosContext";

interface TimeItem {
  initial: number;
  counter: number;
}

type Stage = "pomodoro" | "shortBreak" | "longBreak";

export default function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(
    defaultConfig.colorThemes[0],
  );
  const [tabNumber, setTabNumber] = useState(0);

  const config = useConfigContext() as DefaultConfig;

  const [currentStage, setCurrentStage] = useState<Stage>("pomodoro");

  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const tabMessageMap: { [key: number]: string } = {
    0: "Time to focus!",
    1: "Time for a short break!",
    2: "Time for a long break!",
  };

  const pomodoros = usePomodorosContext() as IPomodoro[];
  const dispatch = usePomodorosDispatch() as React.Dispatch<any>;

  const currentPomodoro = useMemo(() => {
    if (!pomodoros.length) return 0;
    return pomodoros.find(({ id }) => id === currentRound + 1);
  }, [pomodoros]);

  const toNextStage = () => {
    if (!currentPomodoro) {
      console.error("No current pomodoro found");
      return;
    }

    // trigger end of the current timer/setInterval in useEffect
    setIsRunning(false);

    // move from pomodoro to shortBreak or longBreak
    if (currentStage === "pomodoro") {
      const nextStage = Object.keys(currentPomodoro)[2] as Stage; // a pomodoro object has 3 keys: id, pomodoro, shortBreak or longBreak
      const tabNumber = nextStage !== "shortBreak" ? 2 : 1;
      setCurrentStage(nextStage);
      setTabNumber(tabNumber);
      return;
    }

    const noMorePomodoros = pomodoros.length === currentRound + 1;

    // create, add and set state to display a new pomodoro
    if (noMorePomodoros) {
      const longBreakDue = (currentRound + 2) % config.longBreakInterval === 0;

      // create new pomodoro
      const newPomodoro = {
        id: pomodoros.length + 1,
        pomodoro: {
          initial: config.stageSeconds["pomodoro"],
          counter: config.stageSeconds["pomodoro"],
        },
        [!longBreakDue ? "shortBreak" : "longBreak"]: {
          initial:
            config.stageSeconds[!longBreakDue ? "shortBreak" : "longBreak"],
          counter:
            config.stageSeconds[!longBreakDue ? "shortBreak" : "longBreak"],
        },
      };

      // add new pomodoro
      dispatch({
        type: "add",
        value: newPomodoro,
      });

      setCurrentRound((prev) => prev + 1);
      setCurrentStage("pomodoro"); // 'pomodoro' is always the first stage
      setTabNumber(0); // sets tab to 'pomodoro'
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsRunning(false);
    setTabNumber(newValue);
    setBackgroundColor(config.colorThemes[newValue]);
    if (newValue === 0) {
      setCurrentStage("pomodoro");
    }
    if (newValue === 1) {
      setCurrentStage("shortBreak");
    }
    if (newValue === 2) {
      setCurrentStage("longBreak");
    }
  };

  const resetCurrentTimer = () => {
    if (!currentPomodoro || !currentPomodoro[currentStage]) {
      console.error("No currentPomodoro or currentStage found");
      return;
    }

    if (currentStage === "pomodoro" && !config.autoStartPomodoroEnabled) {
      setIsRunning(false);
    }

    if (
      (currentStage === "shortBreak" || currentStage === "longBreak") &&
      !config.autoStartBreaksEnabled
    ) {
      setIsRunning(false);
    }

    dispatch({
      type: "resetTimer",
      id: currentRound + 1,
      timer: currentStage,
      value: currentPomodoro[currentStage].initial,
    });
  };

  useEffect(() => {
    if (isRunning && !intervalId.current) {
      console.log("Setting interval");
      intervalId.current = setInterval(() => {
        if (currentPomodoro && currentPomodoro[currentStage]) {
          dispatch({
            type: "decrement",
            id: currentRound + 1,
            timer: currentStage,
            value: currentPomodoro[currentStage].counter - 1,
          });
        } else {
          console.error(
            "No currentPomodoro or currentStage found in setInterval",
          );
        }
      }, 1000);
    }

    if (!isRunning && intervalId.current) {
      console.log("Clearing interval");
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      if (intervalId.current) {
        console.log("Clearing interval on cleanup");
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isRunning]);

  // handle auto start of pomodoro or breaks
  useEffect(() => {
    if (config.autoStartPomodoroEnabled && currentStage === "pomodoro") {
      setIsRunning(true);
      return;
    }

    if (
      (config.autoStartBreaksEnabled && currentStage === "shortBreak") ||
      currentStage === "longBreak"
    ) {
      setIsRunning(true);
      return;
    }
  }, [currentStage]);

  const circularProgressValue = useMemo(() => {
    if (!currentPomodoro || !currentPomodoro[currentStage]) {
      console.error(
        "No currentPomodoro or currentStage found when calculating circularProgressValue",
      );
      return 0;
    }

    return (
      (currentPomodoro[currentStage].counter /
        currentPomodoro[currentStage].initial) *
      97.15
    );
  }, [pomodoros, currentStage]);

  const timer = useMemo(() => {
    if (!currentPomodoro || !currentPomodoro[currentStage]) {
      console.error(
        "No currentPomodoro or currentStage found when calculating timer",
      );
      return 0;
    }

    return !pomodoros.length
      ? formatTime(0)
      : formatTime(currentPomodoro[currentStage].counter);
  }, [pomodoros, currentStage]);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <ResponsiveAppBar setIsRunning={setIsRunning} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: backgroundColor,
          transition: "background-color 0.5s",
          height: "100vh",
          margin: "0",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            width: "100%",
            display: "flex",
          }}
        ></Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "16%",
            }}
          >
            <svg width={0} height={0}>
              <defs>
                <linearGradient
                  id="my_gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress
              variant="determinate"
              size="40rem"
              value={circularProgressValue}
              sx={{
                "svg circle": {
                  stroke: "url(#my_gradient)",
                  strokeLinecap: "round",
                },
              }}
            />
          </div>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              px: 10,
              bgcolor: backgroundColor,
              transition: "background-color 0.5s",
            }}
          >
            <Tabs
              value={tabNumber}
              onChange={handleChange}
              indicatorColor="primary"
            >
              <Tab label="Pomodoro" />
              <Tab
                label="Short Break"
                disabled={
                  !pomodoros.length ||
                  !Object.keys(pomodoros[currentRound]).includes("shortBreak")
                }
              />
              <Tab
                label="Long Break"
                disabled={
                  !pomodoros.length ||
                  !Object.keys(pomodoros[currentRound]).includes("longBreak")
                }
              />
            </Tabs>
            <Typography
              variant="h1"
              sx={{
                fontSize: "9rem",
                textAlign: "center",
              }}
            >
              {timer}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="text" onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="text" onClick={() => toNextStage()}>
                Skip
              </Button>
              <Button variant="text" onClick={() => resetCurrentTimer()}>
                Reset
              </Button>
            </Box>
          </Paper>
          <Typography variant="h6" sx={{ color: "text.secondary", mt: 2 }}>
            #{currentRound + 1}
          </Typography>
          <Typography variant="h5">{tabMessageMap[tabNumber]}</Typography>
        </Box>

        <Copyright />
      </Box>
    </Container>
  );
}
