import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import NewsDetail from "./pages/NewsDetail";
import Preferences from "./pages/Preferences";
import ProtectedRoute from "./components/ProtectedRoute";
import { useToast } from "@/components/ui/use-toast";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    toast({
      title: "Login successful",
      description: "Welcome to your personalized news digest",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      <Routes>
        <Route path="/" element={<Login login={login} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/news/:id" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewsDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/preferences" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Preferences />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
