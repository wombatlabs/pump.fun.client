import { Routes, Route, Navigate } from 'react-router-dom';
import {BoardPage} from "./pages/board";
import {AppLayout} from "./components/layout";
import {Page404} from "./pages/not-found";
import {TokenPage} from "./pages/token";

export const AppRoutes = () => {
  return <Routes>
    <Route element={<AppLayout />}>
      <Route path={'/'} element={<Navigate to={'board'} />} />
      <Route path={'/board'} element={<BoardPage />} />
      <Route path={'/:tokenId'} element={<TokenPage />} />
      <Route path={'*'} element={<Page404 />} />
    </Route>
  </Routes>
}
