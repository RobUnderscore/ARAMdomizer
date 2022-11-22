import { blue, pink, purple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
          light: blue[300],
          main: purple[500],
          dark: blue[700],
        },
        secondary: {
          light: pink[300],
          main: "#11cb5f",
          dark: pink[700],
        },
      },
});