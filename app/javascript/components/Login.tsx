import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import fetchClient from '../helpers/fetchClient';

interface Props {
  handleLogin: Function
};
interface State {
  email_address: string,
  name: string,
  password: string,
  errors: string[]
};

class Login extends React.Component<Props&RouteComponentProps, State> {
  state: State = {
    email_address: '',
    name: '',
    password: '',
    errors: []
  }
  redirect = () => {
    this.props.history.push('/');
  };
  handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
      const { name, value } = event.target
      this.setState(prevState => ({
        ...prevState,
        [name]: value
      }));
  };
  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { email_address, password } = this.state;
    let user = { email_address, password };

    fetchClient.post('/v1/authentication', { user })
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
          this.props.handleLogin(response.data);
          this.redirect()
        } else {
          this.setState({ errors: response.data.errors });
        }
      })
      .catch(error => console.log('error: ', error));
  }
  render() {
    const { email_address, name, password } = this.state;
    return (
      <div>
        <h2 className='content-head'>Log In</h2>
        <form className='pure-form' onSubmit={this.handleSubmit}>
          <fieldset>
            <input
              placeholder="email"
              type="text"
              name="email_address"
              value={email_address}
              onChange={this.handleChange}
            />
            <input
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <button className='pure-button' type="submit">
              Log In
            </button>
            <div>
              or <Link className='pure-button' to='/register'>Register</Link>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default withRouter(Login)
