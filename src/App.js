import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomizeScreen from './routes/customizeScreen/customizeScreen.component';
import Authentication from './routes/auth/authentication.component';
import Navigation from './routes/navigation/navigation.component';
import UserPage from './routes/users/users.component';

function App() {
  return (
  
    <Router>
      <Routes>
        <Route path='/' element={<Navigation />}>
        <Route path="auth" element={<Authentication />} />
        <Route path="make" element={<CustomizeScreen />} />
        <Route path="user/:username" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
