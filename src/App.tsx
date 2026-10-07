import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppData } from "./hooks/useAppData";
import { BottomNav } from "./components/BottomNav";
import { TodayPage } from "./pages/TodayPage";
import { TimerPage } from "./pages/TimerPage";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { ActivityDetailPage } from "./pages/ActivityDetailPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  const app = useAppData();

  return (
    <BrowserRouter>
      <main className="mx-auto min-h-screen max-w-2xl bg-stone-50 pb-24 text-stone-900">
        <Routes>
          <Route path="/" element={<TodayPage app={app} />} />
          <Route path="/timer" element={<TimerPage app={app} />} />
          <Route path="/activities" element={<ActivitiesPage app={app} />} />
          <Route
            path="/activities/:activityId"
            element={<ActivityDetailPage app={app} />}
          />
          <Route path="/history" element={<HistoryPage app={app} />} />
        </Routes>

        <BottomNav />
      </main>
    </BrowserRouter>
  );
}