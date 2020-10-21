import * as React from "react";
import {
  BrowserRouter,
  Link,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import fetchClient from '../helpers/fetchClient';

import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import ShiftOverview from '../components/ShiftOverview';
import UserEdit from "./UserEdit";

type User = {
  id: number,
  name: string,
  email_address: string
}
interface Props { };
interface State {
  token?: string,
  user?: User
};

class App extends React.Component<Props & RouteComponentProps, State> {
  state: State = { }
  handleLogin = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.setState({
      token: data.token,
      user: data.user
    }, () => this.props.history.push(this.props.location.pathname));
  };
  handleLogout = () => {
    localStorage.clear();
    this.setState({
      token: null,
      user: null
    }, () => this.props.history.push('/login'));
  };

  loginStatus = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    let token = localStorage.getItem('token');

    if (!token) this.handleLogout();
    else
      fetchClient.get(`/v1/users/${user?.id}`)
        .then(response => {
          if (response.status === 200) {
            this.handleLogin({ ...response.data, token });
          } else {
            this.handleLogout();
          }
        })
        .catch(error => {
          console.log('api errors:', error);
          this.handleLogout();
        });
  };

  componentDidMount() {
    this.loginStatus();
  }

  render() {
    const { token, user } = this.state;
    if (!token && this.props.location.pathname !== '/login') return (<h1 className='content-head is-center'>Loading</h1>);
    return (
      <>
        <div className='header'>
          <div className='pure-menu pure-menu-horizontal'>
            <a className='pure-menu-heading is-center'>Adnat</a>
            <ul></ul>
          </div>
        </div>
        <div style={{clear: 'both'}}></div>
        <div className='content-wrapper'>
          <div className='content'>
            <div className='pure-g'>
              <div className='pure-u-1-8'></div>
              <div className='pure-u-6-8'>
                { token && 
                  <div>
                    Logged in as {user?.name} 
                    <Link className='pure-button' to='/user'>Edit</Link>
                    <button className='pure-button' onClick={this.handleLogout}>Log Out</button>
                  </div>
                }
                <Switch>
                  <Route exact path="/" render={props => (<Home {...props} user={this.state.user} />)} />
                  <Route path="/login" render={props => (<Login {...props} handleLogin={this.handleLogin} />)} />
                  <Route path="/register" render={props => (<Register {...props} handleLogin={this.handleLogin} />)} />
                  <Route path="/user" render={props => (<UserEdit {...props} user={this.state.user} />)} />
                  <Route path="/organization/:organization_id/shifts" render={props => (<ShiftOverview {...props} user={this.state.user} />)} />
                </Switch>
              </div>
              <div className='pure-u-1-8'></div>
            </div>

          </div>
        </div>
      </>
    );
  }
}

export default withRouter(App);