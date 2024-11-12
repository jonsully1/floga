import defaultConfig from "./defaultConfig";

const defaultPomodoro = {
  pomodoro: {
    initial: defaultConfig.stageSeconds["pomodoro"],
    counter: defaultConfig.stageSeconds["pomodoro"],
  },
  shortBreak: {
    initial: defaultConfig.stageSeconds["shortBreak"],
    counter: defaultConfig.stageSeconds["shortBreak"],
  },
};

export default defaultPomodoro;
export type IPomodoro = typeof defaultPomodoro;
