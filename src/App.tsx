import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MessageTemplatesDashboard from './components/dashboard/MessageTemplatesDashboard';
import { TemplateBuilder } from './components/TemplateBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MessageTemplatesDashboard />} />
        <Route path="/create" element={<TemplateBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;