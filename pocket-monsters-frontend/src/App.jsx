import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Monsters from './components/Monsters';
import Types from './components/Types';
import MonsterDetail from './components/MonsterDetail';
import MonsterForm from './components/MonsterForm';
import TypeDetail from './components/TypeDetail';
import TypeForm from './components/TypeForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="monsters" element={<Monsters />} />
          <Route path="monsters/:id" element={<MonsterDetail />} />
          <Route path="monsters/new" element={<MonsterForm />} />
          <Route path="types" element={<Types />} />
          <Route path="types/:id" element={<TypeDetail />} />
          <Route path="types/new" element={<TypeForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
