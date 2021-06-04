import Header from "./components/Header"
import Main from './components/Main'

function App() {
  return (
    <div className="container">
      <Header title = {'Triangle App'} style = {{Header:'center'}} />
      <Main />
    </div>
  );
}

export default App;
