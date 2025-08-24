import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home, Experience, Projects } from "./pages";

const App = () => {
  return (
    <main className="bg-slate-300/20 h-FULL">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/*"
            element={
              <>
                <Routes>
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/projects" element={<Projects />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
