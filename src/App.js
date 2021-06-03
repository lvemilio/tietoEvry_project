import Header from "./components/Header"
import Sides from './components/Sides'
function App() {
  return (
    <div className="container">

      <Header title = {'Triangle App'} style = {{Header:'center'}} />
      <Sides />
    </div>
  );
}

export default App;
