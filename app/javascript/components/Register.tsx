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
  password_confirmation: string,
  errors: string[]
};

class Register extends React.Component<Props & RouteComponentProps, State> {
  state: State = {
    email_address: '',
    name: '',
    password: '',
    password_confirmation: '',
    errors: []
  }
  handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
      const { name, value } = event.target
      this.setState(prevState => ({
        ...prevState,
        [name]: value
      }));
  };
  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { email_address, name, password, password_confirmation } = this.state;
    let user = { email_address, name, password, password_confirmation };

    fetchClient.post('/v1/users', { user })
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
          this.props.handleLogin(response.data);
          this.props.history.push('/');
        } else {
          this.setState({ errors: response.data.errors });
        }
      })
      .catch(error => console.log('error: ', error));
  }
  render() {
    const { email_address, name, password, password_confirmation } = this.state;
    return (
      <>
        <h2 className='content-head'>Register</h2>
        <form onSubmit={this.handleSubmit} className='pure-form pure-form-stacked'>
          <fieldset>
            <input
              placeholder="email"
              type="text"
              name="email_address"
              value={email_address}
              onChange={this.handleChange}
            />
            <input
              placeholder="name"
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <input
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <input
              placeholder="confirm"
              type="password"
              name="password_confirmation"
              value={password_confirmation}
              onChange={this.handleChange}
            />
            <button className='pure-button' placeholder="submit" type="submit">
              Register
            </button>
            <div>
              or <Link className='pure-button' to='/login'>Log In</Link>
            </div>
          </fieldset>
        </form>
      </>
    );
  }
}

export default withRouter(Register);