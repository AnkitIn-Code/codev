import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard     from './pages/Dashboard/Dashboard';
import Problems      from './pages/Problems/Problems';
import Topics        from './pages/Topics/Topics';
import TopicDetail   from './pages/TopicDetail/TopicDetail';
import Companies     from './pages/Companies/Companies';
import CompanyDetail from './pages/CompanyDetail/CompanyDetail';
import Sheets        from './pages/Sheets/Sheets';
import SheetDetail   from './pages/SheetDetail/SheetDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                     element={<Dashboard />} />
          <Route path="/problems"             element={<Problems />} />
          <Route path="/topics"               element={<Topics />} />
          <Route path="/topics/:slug"         element={<TopicDetail />} />
          <Route path="/companies"            element={<Companies />} />
          <Route path="/companies/:slug"      element={<CompanyDetail />} />
          <Route path="/sheets"               element={<Sheets />} />
          <Route path="/sheets/:id"           element={<SheetDetail />} />
          {/* Catch-all redirect */}
          <Route path="*"                     element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
