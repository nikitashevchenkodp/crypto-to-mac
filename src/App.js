
import './App.css';
import Header from './components/header';
import CoinPage from './pages/coin-page';
import HomePage from './pages/home-page';
import { BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import Alert from './components/alert';

import PortfolioPage from './pages/portfolio-page/portfolio-page';
import PortfolioCoinPage from './pages/portfolio-coin-page/portfolio-coin-page';
import { Redirect } from 'react-router-dom';



function App() {

  const classes = {
    App: {
      backgroundColor: '#14161a',
      color: "white",
      minHeight: "100vh"
    }
  }
    

  return (
    <Router>
      <div style={classes.App}>
        <Header />
          <Route path="/" component={HomePage} exact />
          <Route path="/coins/:id" component={CoinPage} exact />
          <Route path="/portfolio" component={PortfolioPage} exact />
          <Route path="/portfolio/:id" component={PortfolioCoinPage} exact />
      </div>
      <Alert />
    </Router>
  );
}

export default App;
