"use client";
import { type Dispatch, useEffect, useMemo, useRef, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Copyright from "@/components/Copyright";
import Paper from "@mui/material/Paper";
import {
  CircularProgress,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import React from "react";
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import defaultConfig from "@/lib/defaultConfig";
import { IConfigContext, useConfigContext } from "@/context/ConfigContext";
import { formatTime } from "@/lib/time";
import {
  usePomodorosContext,
  usePomodorosDispatch,
  type IPomodoro,
  type Action,
} from "@/context/PomodorosContext";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestoreIcon from "@mui/icons-material/Restore";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

type Stage = "pomodoro" | "shortBreak" | "longBreak";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#000",
    ...theme.applyStyles("dark", {
      backgroundColor: "#000",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundImage: "linear-gradient(90deg, #e01cd5, #1CB5E0)", // Apply gradient
  },
}));

export default function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(
    defaultConfig.colorThemes[0],
  );
  const [tabNumber, setTabNumber] = useState(0);

  const { config, configLoading } = useConfigContext() as IConfigContext;

  const [currentStage, setCurrentStage] = useState<Stage>("pomodoro");

  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  const tabMessageMap: { [key: number]: string } = {
    0: "Time to focus!",
    1: "Time for a short break!",
    2: "Time for a long break!",
  };

  const pomodoros = usePomodorosContext() as IPomodoro[];
  const dispatch = usePomodorosDispatch() as Dispatch<Action>;

  const currentPomodoro = useMemo(() => {
    if (!pomodoros.length) return 0;
    return pomodoros.find(({ id }) => id === currentRound + 1);
  }, [pomodoros, currentRound]);

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

    // if we have more pomodoros, move to the next pomodoro
    if (!noMorePomodoros) {
      const nextStage = "pomodoro";
      const tabNumber = 0;
      setCurrentStage(nextStage);
      setTabNumber(tabNumber);
      setCurrentRound((prev) => prev + 1);
    }
  };

  const toPreviousStage = () => {
    if (!currentPomodoro) {
      console.error("No current pomodoro found");
      return;
    }

    // trigger end of the current timer/setInterval in useEffect
    setIsRunning(false);

    // this should never happen as we have disapled the button when the currentRound is 0 and the currentStage is pomodoro
    if (currentStage === "pomodoro" && currentRound === 0) {
      console.error("No previous pomodoro found");
      return;
    }

    if (currentStage === "shortBreak" || currentStage === "longBreak") {
      const previousStage = Object.keys(currentPomodoro)[1] as Stage; // a pomodoro object has 3 keys: id, pomodoro, shortBreak or longBreak
      const tabNumber = 0;
      setCurrentStage(previousStage);
      setTabNumber(tabNumber);
      return;
    }

    if (currentStage === "pomodoro" && currentRound > 0) {
      const currentPomodoroId = Object.values(currentPomodoro)[0]; // a pomodoro object has 3 keys: id, pomodoro, shortBreak or longBreak
      console.log({ currentPomodoroId });
      const previousPomodoro = pomodoros?.find(
        ({ id }) => id === currentPomodoroId - 1,
      );

      if (!previousPomodoro) {
        console.error("No previous pomodoro found");
        return;
      }

      const previousStage = Object.keys(previousPomodoro)[2] as Stage; // a pomodoro object has 3 keys: id, pomodoro, shortBreak or longBreak
      const tabNumber = previousStage !== "shortBreak" ? 2 : 1;
      setCurrentStage(previousStage);
      setTabNumber(tabNumber);
      setCurrentRound((prev) => prev - 1);
      return;
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
          const timeLeft = currentPomodoro[currentStage].counter;

          // sound alarm 10 seconds before the end of the timer
          if (timeLeft === 10) {
            // setup alarm
            let playCount = 0;
            const alarmSound =
              currentStage === "pomodoro"
                ? "pomodoroAlarmSound"
                : "breakAlarmSound";
            const alarmSoundVolume =
              currentStage === "pomodoro"
                ? "pomodoroAlarmSoundVolume"
                : "breakAlarmSoundVolume";
            const alarm = new Audio(`/audio/${config[alarmSound]}.mp3`);
            alarm.volume = config[alarmSoundVolume] / 100;

            // play alarm
            alarm.addEventListener("ended", () => {
              playCount++;
              if (playCount < config.alarmRepeatTimes) {
                alarm.play();
              }
            });
            alarm.play();
          }

          // move to the next stage when the timer reaches 0
          if (timeLeft === 0) {
            toNextStage();
            return;
          }

          // decrement the current timer
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

    if (configLoading) {
      return 0;
    }

    return (
      (currentPomodoro[currentStage].counter /
        currentPomodoro[currentStage].initial) *
      98.7
    );
  }, [pomodoros, currentStage, configLoading]);

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "auto", sm: "100%" },
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "4.75rem",
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
                  strokeWidth: "0.1rem",
                },
                display: {
                  xs: "none", // hide circular progress on small screens
                  sm: "block",
                  transition: "background-color 0.5s",
                },
              }}
            />
          </div>
          <Box
            sx={{
              width: "100%",
              display: {
                xs: "block", // show linear progress on small screens
                sm: "none",
              },
            }}
          >
            <BorderLinearProgress
              variant="determinate"
              value={circularProgressValue}
              sx={{
                mb: 1,
              }}
            />
          </Box>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              px: 8,
              bgcolor: backgroundColor,
              transition: "background-color 0.5s",
            }}
          >
            <Tabs
              value={tabNumber}
              onChange={handleChange}
              indicatorColor="primary"
              sx={{
                pb: { xs: 3, sm: 0 },
              }}
            >
              <Tab
                label="Pomodoro"
                disabled={configLoading}
                sx={{
                  display: {
                    xs: currentStage !== "pomodoro" ? "none" : "flex",
                    sm: "flex",
                  },
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              />
              <Tab
                label="Short Break"
                disabled={
                  configLoading ||
                  !pomodoros.length ||
                  !Object.keys(pomodoros[currentRound]).includes("shortBreak")
                }
                sx={{
                  display: {
                    xs: currentStage !== "shortBreak" ? "none" : "flex",
                    sm: "flex",
                  },
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              />
              <Tab
                label="Long Break"
                disabled={
                  configLoading ||
                  !pomodoros.length ||
                  !Object.keys(pomodoros[currentRound]).includes("longBreak")
                }
                sx={{
                  display: {
                    xs: currentStage !== "longBreak" ? "none" : "flex",
                    sm: "flex",
                  },
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
              />
            </Tabs>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "4.5rem", sm: "6rem", md: "8rem" },
                textAlign: "center",
                color: !configLoading ? "white" : "text.secondary",
                mb: { xs: 1, sm: 0 },
              }}
            >
              {timer}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <IconButton
                onClick={() => toPreviousStage()}
                disabled={
                  configLoading ||
                  (currentRound === 0 && currentStage === "pomodoro")
                }
                aria-label="previous"
              >
                <SkipPreviousIcon
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() => setIsRunning(!isRunning)}
                disabled={configLoading}
                aria-label={isRunning ? "pause" : "play"}
              >
                {isRunning ? (
                  <PauseIcon
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem" },
                    }}
                  />
                ) : (
                  <PlayArrowIcon
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem" },
                    }}
                  />
                )}
              </IconButton>
              <IconButton
                onClick={() => toNextStage()}
                disabled={configLoading}
                aria-label="skip"
              >
                <SkipNextIcon
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                  }}
                />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 0.5,
              }}
            >
              <IconButton
                onClick={() => resetCurrentTimer()}
                disabled={configLoading}
                aria-label="reset"
              >
                <RestoreIcon
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem" },
                  }}
                />
              </IconButton>
            </Box>
          </Paper>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mt: 2,
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
              },
            }}
          >
            #{!configLoading ? currentRound + 1 : ""}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.25rem", sm: "2rem" },
              display: !configLoading ? "block" : "none",
            }}
          >
            {tabMessageMap[tabNumber]}
          </Typography>
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "60%",
                md: "40%",
                lg: "30%",
              },
              display: !configLoading ? "none" : "block",
            }}
          >
            <LinearProgress
              sx={{
                my: 2,
              }}
            />
          </Box>
        </Box>

        <Copyright />
      </Box>
    </Container>
  );
}
