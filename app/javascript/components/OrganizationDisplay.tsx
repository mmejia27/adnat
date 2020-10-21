import * as React from 'react';
import { Link } from 'react-router-dom';
import fetchClient from '../helpers/fetchClient';

interface Props {
  handleUpdatedOrganizations: () => void;
  organization: any,
  user_id?: number
};
interface State { };

class OrganizationDisplay extends React.Component<Props, State> {

  handleLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const { user_id, organization } = this.props;
    fetchClient.delete(`/v1/organizations/${organization.id}/membership/${user_id}`)
      .then(() => {
        this.props.handleUpdatedOrganizations();
      });
  };

  render() {
    const { organization } = this.props;
    return (
      <div>
        <h2>{organization.name}</h2>
        <Link className='pure-button' to={`/organization/${organization.id}/shifts`}>View Shifts</Link> 
        <button className='pure-button' onClick={this.handleLeave}>Leave</button>
      </div>
    );
  }
}

export default OrganizationDisplay;