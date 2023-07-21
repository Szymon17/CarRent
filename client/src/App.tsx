import { Route, Routes } from "react-router-dom";
import Navigation from "./routes/navigation/navigation.component";
import Home from "./routes/home/home.component";
import LogIn from "./routes/log-in/log-in.component";
import Register from "./routes/register/register.component";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { logOut } from "./store/user/user.reducer";
import { selectUser } from "./store/user/user.selectors";
import { useEffect } from "react";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) dispatch(logOut);
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
