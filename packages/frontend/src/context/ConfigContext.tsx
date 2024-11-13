"use client";
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { type DefaultConfig } from "@/lib/defaultConfig";

export interface IConfigContext {
  config: DefaultConfig;
  configLoading: boolean;
}

export type Action =
  | {
      type: "update";
      prop: string;
      value: number | string | boolean;
    }
  | {
      type: "update:stageSeconds";
      prop: string;
      value: number | string | boolean;
    }
  | {
      type: "setConfig";
      value: DefaultConfig;
    };

export const ConfigContext = createContext<IConfigContext | null>(null);
export const ConfigDispatchContext = createContext<Dispatch<Action> | null>(
  null,
);

export default function ConfigProvider({
  defaultConfig,
  children,
}: {
  defaultConfig: DefaultConfig;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [config, dispatch] = useReducer(configReducer, defaultConfig);

  useEffect(() => {
    const storedConfig = localStorage.getItem("config");
    if (storedConfig) {
      const config: DefaultConfig = JSON.parse(storedConfig);
      if (config?.stageSeconds) {
        dispatch({
          type: "setConfig",
          value: config,
        });
      } else {
        console.error("Invalid config in local storage:", config);
      }
    }
    setLoading(false);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, configLoading: loading }}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

function configReducer(config: DefaultConfig, action: Action): DefaultConfig {
  switch (action.type) {
    case "update": {
      const newConfig = { ...config, [action.prop]: action.value };
      localStorage.setItem("config", JSON.stringify(newConfig));
      return newConfig;
    }
    case "update:stageSeconds": {
      const newConfig = {
        ...config,
        stageSeconds: { ...config.stageSeconds, [action.prop]: action.value },
      };
      localStorage.setItem("config", JSON.stringify(newConfig));
      return newConfig;
    }
    case "setConfig": {
      return action.value;
    }
    default: {
      console.error("Unknown action type:", action);
      return config;
    }
  }
}

export const useConfigContext = () => useContext(ConfigContext);
export const useConfigDispatch = () => useContext(ConfigDispatchContext);
