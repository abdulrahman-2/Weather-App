import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { WheatherApp } from "./componets/WheatherApp";
import Container from "@mui/material/Container";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ["IMB"],
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <WheatherApp />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
