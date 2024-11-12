import * as React from "react";
import Box from "@mui/material/Box";
import CustomModal from "../Modal";
import Typography from "@mui/material/Typography";
import TimerIcon from "@mui/icons-material/Timer";
import QuantityInput from "../forms/NumberInputQuantity";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import { useConfigContext, useConfigDispatch } from "@/context/ConfigContext";
import { DefaultConfig } from "@/lib/defaultConfig";
import { type Dispatch, useEffect, useRef } from "react";
import { deepEqual } from "@/lib/general";
import { usePomodorosDispatch } from "@/context/PomodorosContext";

export default function SettingsModal({
  title,
  setIsRunning,
}: {
  title: string;
  setIsRunning: Dispatch<any>;
}) {
  const config = useConfigContext() as DefaultConfig;
  const dispatchConfig = useConfigDispatch() as Dispatch<any>;
  const dispatchPomodoros = usePomodorosDispatch() as Dispatch<any>;
  const prevStageSecondsRef = useRef(config.stageSeconds);

  const handleSetConfig = (prop: string, value: number | boolean | string) => {
    const propValues = prop.split(":");
    if (propValues.length === 2) {
      // update a nested config property
      dispatchConfig({
        type: `update:${propValues[0]}`,
        prop: propValues[1],
        value: (value as number) * 60,
      });
    } else {
      dispatchConfig({ type: "update", prop, value });
    }
  };

  useEffect(() => {
    if (!deepEqual(prevStageSecondsRef.current, config.stageSeconds)) {
      // stop timer if running
      setIsRunning(false);

      dispatchPomodoros({
        type: "resetInitialState",
        value: [
          {
            id: 1,
            pomodoro: {
              initial: config.stageSeconds["pomodoro"],
              counter: config.stageSeconds["pomodoro"],
            },
            shortBreak: {
              initial: config.stageSeconds["shortBreak"],
              counter: config.stageSeconds["shortBreak"],
            },
          },
        ],
      });

      prevStageSecondsRef.current = config.stageSeconds;
    }
  }, [config.stageSeconds]);

  return (
    <CustomModal title={title}>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <TimerIcon />
          <Typography variant="h6">Timers</Typography>
          <Typography sx={{ color: "text.secondary" }}>(minutes)</Typography>
        </Box>
        {/* Timers */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignContent: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">Pomodoro</Typography>
            <QuantityInput
              initialValue={config.stageSeconds["pomodoro"] / 60}
              stage="pomodoro"
              onChange={(value) =>
                handleSetConfig("stageSeconds:pomodoro", value)
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">Short Break</Typography>
            <QuantityInput
              initialValue={config.stageSeconds["shortBreak"] / 60}
              stage="shortBreak"
              onChange={(value) =>
                handleSetConfig("stageSeconds:shortBreak", value)
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">Long Break</Typography>
            <QuantityInput
              initialValue={config.stageSeconds["longBreak"] / 60}
              stage="longBreak"
              onChange={(value) =>
                handleSetConfig("stageSeconds:longBreak", value)
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <FormGroup
              sx={{
                width: "100%",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">Long Break Interval</Typography>
                <QuantityInput
                  initialValue={config.longBreakInterval}
                  stage="longBreak"
                  onChange={(value) =>
                    handleSetConfig("longBreakInterval", value)
                  }
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.autoStartPomodoroEnabled}
                    onChange={(_e, newValue) =>
                      handleSetConfig("autoStartPomodoroEnabled", newValue)
                    }
                  />
                }
                label="Auto Start Pomodoros"
                labelPlacement="start"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  m: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.autoStartBreaksEnabled}
                    onChange={(_e, newValue) =>
                      handleSetConfig("autoStartBreaksEnabled", newValue)
                    }
                  />
                }
                label="Auto Start Breaks"
                labelPlacement="start"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  m: 0,
                }}
              />
            </FormGroup>
          </Box>
          <Divider />
        </Box>
      </Box>
    </CustomModal>
  );
}
