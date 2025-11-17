import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './components/Home/HomePage';
import { AddCandidateForm } from './components/AddCandidate/AddCandidateForm';
import { CandidateList } from './components/CandidateList/CandidateList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-candidate" element={<AddCandidateForm />} />
          <Route path="/candidates" element={<CandidateList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
