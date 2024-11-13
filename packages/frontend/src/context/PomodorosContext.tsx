"use client";
import { createContext, Dispatch, useContext, useReducer } from "react";
import defaultConfig from "@/lib/defaultConfig";

export interface IPomodoro {
  id: number;
  pomodoro: {
    initial: number;
    counter: number;
  };
  shortBreak?: {
    initial: number;
    counter: number;
  };
  longBreak?: {
    initial: number;
    counter: number;
  };
}
type TimerType = "pomodoro" | "shortBreak" | "longBreak";

export type Action =
  | { type: "decrement"; id: number; timer: TimerType; value: number }
  | { type: "resetTimer"; id: number; timer: TimerType; value: number }
  | { type: "add"; value: IPomodoro }
  | { type: "resetInitialState"; value: IPomodoro[] };

const initialPomodoros = [
  {
    id: 1,
    pomodoro: {
      initial: defaultConfig.stageSeconds["pomodoro"],
      counter: defaultConfig.stageSeconds["pomodoro"],
    },
    shortBreak: {
      initial: defaultConfig.stageSeconds["shortBreak"],
      counter: defaultConfig.stageSeconds["shortBreak"],
    },
  },
];

export const PomodorosContext = createContext<IPomodoro[] | null>(null);
export const PomodorosDispatchContext = createContext<Dispatch<Action> | null>(
  null,
);

export default function PomodorosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pomodoros, dispatch] = useReducer(pomodorosReducer, initialPomodoros);

  return (
    <PomodorosContext.Provider value={pomodoros}>
      <PomodorosDispatchContext.Provider value={dispatch}>
        {children}
      </PomodorosDispatchContext.Provider>
    </PomodorosContext.Provider>
  );
}

function pomodorosReducer(pomodoros: IPomodoro[], action: Action): IPomodoro[] {
  switch (action.type) {
    case "decrement": {
      return pomodoros.map((p) => {
        if (p.id === action.id) {
          const timer = action.timer as TimerType;
          if (p[timer] && p[timer].counter !== undefined) {
            p[timer].counter = action.value;
          }
          return p;
        } else {
          return p;
        }
      });
    }
    case "resetTimer": {
      return pomodoros.map((p) => {
        if (p.id === action.id) {
          const timer = action.timer as TimerType;
          if (p[timer] && p[timer].counter !== undefined) {
            p[timer].counter = action.value;
          }
          return p;
        } else {
          return p;
        }
      });
    }
    case "add": {
      return [...pomodoros, action.value];
    }
    case "resetInitialState": {
      return action.value;
    }
    default: {
      console.error("Unknown action type:", action);
      return pomodoros;
    }
  }
}

export const usePomodorosContext = () => useContext(PomodorosContext);
export const usePomodorosDispatch = () => useContext(PomodorosDispatchContext);
