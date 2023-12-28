import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UserDetails from './UserDetails';
import UserDirectory from './UserDirectory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<UserDirectory/>} />
        <Route path="/user/:userId" element={<UserDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;

