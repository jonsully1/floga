"use client";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { type DefaultConfig } from "@/lib/defaultConfig";

type Action =
  | {
      type: "update";
      prop: string;
      value: number | string | boolean;
    }
  | {
      type: "update:stageSeconds";
      prop: string;
      value: number | string | boolean;
    };

export const ConfigContext = createContext<DefaultConfig | null>(null);
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
  const [config, dispatch] = useReducer(configReducer, defaultConfig);

  return (
    <ConfigContext.Provider value={config}>
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
      return newConfig;
    }
    case "update:stageSeconds": {
      const newConfig = {
        ...config,
        stageSeconds: { ...config.stageSeconds, [action.prop]: action.value },
      };
      return newConfig;
    }
    default: {
      console.error("Unknown action type:", action);
      return config;
    }
  }
}

export const useConfigContext = () => useContext(ConfigContext);
export const useConfigDispatch = () => useContext(ConfigDispatchContext);
