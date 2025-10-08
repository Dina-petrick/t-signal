import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MessageTemplatesDashboard from './components/dashboard/MessageTemplatesDashboard';
import { TemplateBuilder } from './components/TemplateBuilder';

function App() {
  return (
    <div className="rsp-min-h-screen rsp-p-4">
      <Router>
        <Routes>
          <Route path="/" element={<MessageTemplatesDashboard />} />
          <Route path="/create" element={<TemplateBuilder />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;