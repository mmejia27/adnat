import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import fetchClient from '../helpers/fetchClient';
import OrganizationDisplay from './OrganizationDisplay';
import OrganizationEditor from './OrganizationEditor';

type User = {
  id: number,
  name: string,
  email_address: string
}
interface Props {
  user?: User
};
interface State {
  user_organizations?: any[],
  organizations?: any[],
  errors?: string[]
};

export default class Home extends React.Component<Props, State> {
  state: State = {}

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (user && user.id !== prevProps.user?.id) {
      this.updateUserOrganizations(user);
    }
  }

  private updateUserOrganizations(user?: User) {
    fetchClient.get(`/v1/users/${user?.id}/organizations`)
      .then(response => {
        this.setState({ user_organizations: response.data.organizations });
      })
      .catch(error => console.log('error: ', error));
  }

  componentDidMount() {
    this.handleUpdatedOrganizations();
  }

  handleUpdatedOrganizations = () => {
    const { user } = this.props;
    this.updateOrganizations();
    this.updateUserOrganizations(user);
  };

  updateOrganizations = () => {
    fetchClient.get(`/v1/organizations`, { withCredentials: true })
      .then(response => {
        this.setState({ organizations: response.data.organizations });
      })
      .catch(error => console.log('error: ', error));
  };

  render() {
    const { user } = this.props;
    const { user_organizations } = this.state;
    
    return (
      <>
        <h2 className='content-head is-center'>Home</h2>

        {
          (this.state.user_organizations?.length > 0)
            ? this.state.user_organizations.map(org => {
              return <OrganizationDisplay key={org.id}
                handleUpdatedOrganizations={this.handleUpdatedOrganizations}
                user_id={this.props.user?.id}
                organization={org} />
            })
            : <p>You aren't a member of any organizations. Join an existing one or create a new one</p>
        }

        <h3 className='content-head'>Organizations</h3>
        {
          (this.state.organizations?.length > 0)
            ? this.state.organizations.map(org => {
              return <OrganizationEditor key={org.id}
                handleUpdatedOrganizations={this.handleUpdatedOrganizations}
                user_organizations={user_organizations}
                user_id={this.props.user?.id}
                organization={org} />
            })
            : (<></>)
        }
        <h3 className='content-head'>Create a New Organization</h3>
        <OrganizationEditor handleUpdatedOrganizations={this.handleUpdatedOrganizations} />
      </>
    );
  }
}