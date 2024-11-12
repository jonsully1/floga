import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import ConfigProvider from "@/context/ConfigContext";
import PomodoroProvider from "@/context/PomodorosContext";
import defaultConfig from "@/lib/defaultConfig";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme} defaultMode="dark">
            <CssBaseline />
            <ConfigProvider defaultConfig={defaultConfig}>
              <PomodoroProvider>
                {props.children}
              </PomodoroProvider>
            </ConfigProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
