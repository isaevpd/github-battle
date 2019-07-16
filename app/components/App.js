import React from 'react';
import Popular from './Popular';
import * as ReactRouter from 'react-router-dom';
import Nav from './Nav';
import Home from './Home';
import Battle from './Battle';
import {Switch} from 'react-router-dom';

const Router = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Nav/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/battle' component={Battle}/>
            <Route path='/popular' component={Popular}/>
            <Route render={() => <p>Not found!</p>}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
