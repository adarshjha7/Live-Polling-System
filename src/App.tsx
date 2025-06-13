import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PollProvider } from "./context/PollContext";
import Home from "./pages/Home";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentInterface from "./pages/StudentInterface";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PollProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentInterface />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PollProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
