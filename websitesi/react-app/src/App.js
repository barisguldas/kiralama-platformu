import './App.css';
import GirisFormu from './GirisFormu'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hoş Geldiniz!</h1>
        <GirisFormu /> {/* LoginForm bileşenini buraya ekleyin */}
      </header>
    </div>
  );
}

export default App;
