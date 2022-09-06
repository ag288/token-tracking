import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TrackingPage } from './TrackingPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrackingPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
