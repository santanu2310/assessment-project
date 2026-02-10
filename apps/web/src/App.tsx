import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;
