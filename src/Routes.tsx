import { Routes, Route, Navigate } from 'react-router-dom';
import {BoardPage} from "./pages/board";
import {AppLayout} from "./components/layout";
import {Page404} from "./pages/not-found";
import {TokenPage} from "./pages/token";
import {CreatePage} from "./pages/create";
import {ProfilePage} from "./pages/profile";
import {Leaderboard} from "./pages/leaderboard";
import {RulesPage} from "./pages/rules";
import {ReportTokenPage} from "./pages/report/token";

export const AppRoutes = () => {
  return <Routes>
    <Route element={<AppLayout />}>
      <Route path={'/'} element={<Navigate to={'board'} />} />
      <Route path={'/create'} element={<CreatePage />} />
      <Route path={'/board'} element={<BoardPage />} />
      <Route path={'/profile/:userAddress'} element={<ProfilePage />} />
      <Route path={'/:tokenAddress'} element={<TokenPage />} />
      <Route path={'/report/token/:tokenAddress'} element={<ReportTokenPage />} />
      <Route path={'/leaderboard'} element={<Leaderboard />} />
      <Route path={'/rules'} element={<RulesPage />} />
      <Route path={'*'} element={<Page404 />} />
    </Route>
  </Routes>
}
