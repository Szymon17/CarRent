import { Route, Routes } from "react-router-dom";
import Navigation from "./routes/navigation/navigation.component";
import Home from "./routes/home/home.component";
import LogIn from "./routes/log-in/log-in.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="log-in" element={<LogIn />} />
      </Route>
    </Routes>
  );
}

export default App;
