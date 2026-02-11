import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import { ChatProvider } from "./lib/ChatContext";

import "./App.css";

function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route>
          <Route path="/" element={<ChatPage />} />
        </Route>
      </Routes>
    </ChatProvider>
  );
}

export default App;
