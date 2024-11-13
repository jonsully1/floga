import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
import SettingsModal from "./modals/SettingsModal";
import { Dispatch } from "react";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

const settings = ["Settings"];

function ResponsiveAppBar({
  setIsRunning,
}: {
  setIsRunning: Dispatch<boolean>;
}) {
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: { xs: "flex" },
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <SelfImprovementIcon fontSize="large" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Floga
            </Typography>
          </Box>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex" }}>
              {settings.map((setting) => {
                if (setting === "Settings") {
                  return (
                    <SettingsModal
                      key={setting}
                      setIsRunning={setIsRunning}
                    />
                  );
                }
              })}
            </Box>
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
