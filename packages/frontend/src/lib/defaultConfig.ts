const defaultConfig = {
  autoStartBreaksEnabled: false,
  autoStartPomodoroEnabled: false,
  colorThemes: ["rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)"],
  longBreakInterval: 4,
  stageSeconds: {
    pomodoro: 2700,
    shortBreak: 900,
    longBreak: 1500,
  },
  pomodoroAlarmSound: "completed",
  pomodoroAlarmSoundVolume: 50,
  breakAlarmSound: "i-did-it",
  breakAlarmSoundVolume: 50,
  alarmRepeatTimes: 3,
};

export default defaultConfig;
export type DefaultConfig = typeof defaultConfig;
export type IAlarmType = "pomodoroAlarmSound" | "breakAlarmSound";

// // TODO: original defaults
// const defaultConfig = {
//   alarmRepeatTimes: 1,
//   alarmSoundType: "alarm_kitchen",
//   autoCheckTasks: false,
//   autoStartBreaksEnabled: true,
//   autoStartPomodoroEnabled: false,
//   autoSwitchTasks: true,
//   colorThemes: ["rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)"],
//   darkModeEnabled: false,
//   hourFormat: "24-hour",
//   longBreakInterval: 4,
//   notificationMinutes: 5,
//   notificationType: "last",
//   soundVolume: 50,
//   stageSeconds: {
//     pomodoro: 2700,
//     shortBreak: 900,
//     longBreak: 1500,
//   },
//   tickingSoundType: "ticking_none",
//   tickingVolume: 50,
//   webhookUri: "",
//   webpushSubs: [],
// };
