import * as React from "react";
import Box from "@mui/material/Box";
import DialogCustom from "../DialogCustom";
import Typography from "@mui/material/Typography";
import TimerIcon from "@mui/icons-material/Timer";
import QuantityInput from "../forms/NumberInputQuantity";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import {
  IConfigContext,
  useConfigContext,
  useConfigDispatch,
  type Action as ConfigAction,
} from "@/context/ConfigContext";
import { type Dispatch, useEffect, useRef, useState } from "react";
import { deepEqual } from "@/lib/general";
import {
  usePomodorosDispatch,
  type Action as PomodoroAction,
} from "@/context/PomodorosContext";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";

const alarmSoundOptions = [
  { value: "pristine", label: "Pristine" },
  { value: "case-closed", label: "Case closed" },
  { value: "confident", label: "Confident" },
  { value: "dutifully", label: "Dutifully" },
  { value: "finished-task", label: "Finished task" },
  { value: "got-it-done", label: "Got it done" },
  { value: "i-did-it", label: "I did it!" },
  { value: "that-was-quick", label: "That was quick!" },
  { value: "completed", label: "Completed (voice)" },
];

export default function SettingsModal({
  setIsRunning,
}: {
  setIsRunning: Dispatch<boolean>;
}) {
  const { config } = useConfigContext() as IConfigContext;
  const dispatchConfig = useConfigDispatch() as Dispatch<ConfigAction>;
  const dispatchPomodoros = usePomodorosDispatch() as Dispatch<PomodoroAction>;
  const prevStageSecondsRef = useRef(config.stageSeconds);
  const [audioFile, setAudioFile] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = React.useState(false);

  const title = "Settings";
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSetConfig = (prop: string, value: number | boolean | string) => {
    const propValues = prop.split(":");
    if (propValues.length === 2) {
      // update a nested config property
      dispatchConfig({
        type: `update:${propValues[0]}` as "update:stageSeconds",
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

  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  };

  // Effect to initialize audio ref with selected sound
  useEffect(() => {
    // stop playback: triggered by onChangeCommitted event, setting audioFile to '')
    if (!audioFile && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // play audio file
    audioRef.current = new Audio(`/audio/${audioFile}.mp3`);
    audioRef.current.loop = true;
    audioRef.current.play();

    // cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioFile]);

  return (
    <Box>
      <Box>
        <IconButton
          onClick={handleOpen}
          sx={{
            display: { xs: "flex", md: "none" },
          }}
          aria-label="settings"
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
        <Button
          onClick={handleOpen}
          sx={{
            my: 2,
            color: "white",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <SettingsIcon fontSize="small" />
          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            {title}
          </Box>
        </Button>
      </Box>

      <DialogCustom title={title} open={open} handleClose={handleClose}>
        <Box>
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
                  <Typography variant="body1">Long Break Round</Typography>
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
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <MusicNoteIcon />
              <Typography variant="h6">Sounds</Typography>
            </Box>
            <Box sx={{ minWidth: 120, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Pomodoro Alarm Sound
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={config.pomodoroAlarmSound}
                  label="Pomodoro Alarm Sound"
                  onChange={(e: SelectChangeEvent) =>
                    handleSetConfig("pomodoroAlarmSound", e.target.value)
                  }
                >
                  {alarmSoundOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack
                spacing={2}
                direction="row"
                sx={{ alignItems: "center", my: 1 }}
              >
                <VolumeDown />
                <Slider
                  size="small"
                  aria-label="Pomodoro Alarm Sound Volume"
                  value={config.pomodoroAlarmSoundVolume}
                  valueLabelDisplay="auto"
                  onChange={(_e, value) => {
                    setAudioFile(config.pomodoroAlarmSound);
                    handleSetConfig(
                      "pomodoroAlarmSoundVolume",
                      value as number,
                    );
                    handleVolumeChange(value as number);
                  }}
                  onChangeCommitted={() => setAudioFile("")}
                />
                <VolumeUp />
              </Stack>
            </Box>
            <Box sx={{ minWidth: 120, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Break Alarm Sound
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={config.breakAlarmSound}
                  label="Break Alarm Sound"
                  onChange={(e: SelectChangeEvent) =>
                    handleSetConfig("breakAlarmSound", e.target.value)
                  }
                >
                  {alarmSoundOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack
                spacing={2}
                direction="row"
                sx={{ alignItems: "center", my: 1 }}
              >
                <VolumeDown />
                <Slider
                  size="small"
                  aria-label="Break Alarm Sound Volume"
                  value={config.breakAlarmSoundVolume}
                  valueLabelDisplay="auto"
                  onChange={(_e, value) => {
                    setAudioFile(config.breakAlarmSound);
                    handleSetConfig("breakAlarmSoundVolume", value as number);
                    handleVolumeChange(value as number);
                  }}
                  onChangeCommitted={() => setAudioFile("")}
                />
                <VolumeUp />
              </Stack>
            </Box>
          </Box>
        </Box>
      </DialogCustom>
    </Box>
  );
}
