import * as React from 'react';
import fetchClient from '../helpers/fetchClient';

interface Props {
  handleUpdatedOrganizations: Function,
  organization?: any,
  user_organizations?: any[],
  user_id?: number
};
interface State {
  name: string,
  hourly_rate: number,
  errors: string[]
};

class OrganizationEditor extends React.Component<Props, State> {
  state: State = {
    name: this.props.organization?.name ?? '',
    hourly_rate: this.props.organization?.hourly_rate ?? 5,
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
    const { name, hourly_rate } = this.state;

    if (this.props.organization?.id) {
      let organization = { name, hourly_rate, id: this.props.organization.id }
      fetchClient.put(`/v1/organizations/${organization.id}`, { organization })
        .then(response => {
          this.props.handleUpdatedOrganizations(response.data);
        })
        .catch(error => {
          console.log('error: ', error.response);
          this.setState({ errors: error.response.data.errors })
        });
    } else {
    let organization = { name, hourly_rate };
    fetchClient.post('/v1/organizations', { organization })
      .then(response => {
        this.props.handleUpdatedOrganizations(response.data);
      })
      .catch(error => {
        console.log('error: ', error.response);
        this.setState({ errors: error.response.data.errors })
      });
    }
  };

  handleLeave = (organization_id: number) => {
    const { user_id } = this.props;
    fetchClient.delete(`/v1/organizations/${organization_id}/membership/${user_id}`)
      .then(() => {
        this.props.handleUpdatedOrganizations();
      });
  };

  handleJoin = (organization_id: number) => {
    const { user_id } = this.props;
    fetchClient.post(`/v1/organizations/${organization_id}/membership/${user_id}`)
      .then(() => {
        this.props.handleUpdatedOrganizations();
      });
  };

  renderJoinButton= () => {
    const organization_id = this.props.organization?.id;
    if (organization_id) {
      if (this.props.user_organizations?.find(o => o.id === organization_id)) {
        return <button className='pure-button' onClick={() => this.handleLeave(organization_id)}>Leave</button>
      } else {
        return <button className='pure-button' onClick={() => this.handleJoin(organization_id)}>Join</button>
      }
    }
  }

  render() {
    const { name, hourly_rate } = this.state;
    return (
      <div>
        <form className='pure-form' onSubmit={this.handleSubmit}>
          <fieldset>
            <input
              placeholder="name"
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <input
              placeholder="hourly rate"
              type="number"
              name="hourly_rate"
              value={hourly_rate}
              onChange={this.handleChange}
            />
            <button className='pure-button' placeholder="submit" type="submit">Save</button>
            {this.renderJoinButton()}
          </fieldset>
        </form>
        <div>
          {this.state.errors.join(', ')}
        </div>
      </div>
    );
  }
}

export default OrganizationEditor;