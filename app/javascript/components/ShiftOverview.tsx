import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import moment from 'moment';
import fetchClient from '../helpers/fetchClient';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';

interface Props {
  user: any
};
interface State { 
  organization?: any,
  shifts?: any[],
  filter_name?: string,
  filtered_shifts?: any[],
  shift_date?: string,
  shift_start?: string,
  shift_end?: string,
  breaks?: string,
  errors?: string[]
};
interface MatchParams {
  organization_id?: string
}
interface LocalProps extends Props, RouteComponentProps<MatchParams> {}

class ShiftOverview extends React.Component<LocalProps, State> {
  state: State = {
    organization: {},
    filter_name: '',
    shift_date: '',
    shift_start: '',
    shift_end: '',
    breaks: '',
    errors: []
  }

  updateShifts = () => {
    const { organization_id } = this.props.match.params;
    fetchClient.get(`v1/organizations/${organization_id}/shifts`)
      .then(response => {
        this.setState({
          shifts: response.data,
          filtered_shifts: response.data.filter(s => s.user.name.includes(this.state.filter_name))
        })
      })
  };

  updateOrganization = () => {
    const { organization_id } = this.props.match.params;
    fetchClient.get(`v1/organizations/${organization_id}`)
      .then(response => {
        this.setState({
          organization: response.data.organization
        })
      })
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    });
  };

  handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLFormElement>) => {
    const { name, value } = event.target
    const { shifts } = this.state;
    const filtered_shifts = (name === 'filter_name') ? shifts.filter(s => s.user.name.includes(value)) : shifts;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
      filtered_shifts
    }));
  };

  setShiftDate = (date) => {
    this.setState({
      shift_date: date
    });
  };

  handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { shift_date, shift_start, shift_end, breaks, organization } = this.state;
    const date = moment(shift_date);
    const start = moment(`${date.format('MM/DD/YYYY')} ${shift_start}`, 'MM/DD/YYYY hh:mm a');
    const tempend = moment(`${date.format('MM/DD/YYYY')} ${shift_end}`, 'MM/DD/YYYY hh:mm a');
    const overnight = (tempend.diff(start, 'hours', true) <= 0) ? 1 : 0;
    const end = tempend.add(overnight, 'days');
    const breakArr = breaks.trim().split(',').map(b => ({ length: parseInt(b) }));

    const shift = {
      user_id: this.props.user.id,
      organization_id: this.state.organization.id,
      start,
      end,
      breaks_attributes: breakArr
    };

    fetchClient.post('/v1/shifts', { shift })
      .then(() => {
        this.updateShifts();
      })
      .catch(error => {
        console.log('error: ', error.response);
        this.setState({ errors: error.response.data.errors })
      });;
  };

  componentDidMount() {
    this.updateOrganization();
    this.updateShifts();
  }

  renderShift = (shift) => {
    const shiftStart = moment(shift.start);
    const shiftEnd = moment(shift.end);
    const totalBreaks = shift.breaks?.reduce((acc, b) => acc + b.length, 0) / 60.0;
    const hoursWorked = shiftEnd.diff(shiftStart, 'hours', true) - totalBreaks;
    const shiftCost = hoursWorked * this.state.organization.hourly_rate;

    return (
      <tr key={shift.id}>
        <td>{shift.user.name}</td>
        <td>{shiftStart.format('L')}</td>
        <td>{shiftStart.format('LT')}</td>
        <td>{shiftEnd.format('LT')}</td>
        <td>{shift.breaks?.map(b => b.length).join(',')}</td>
        <td>{hoursWorked}</td>
        <td>{shiftCost}</td>
      </tr>
    );
  };

  render() {
    return (
      <>
        <h2 className='content-head'>{this.state.organization.name}</h2>
        
        <h3 className='content-head'>Shifts</h3>

        <form className='pure-form'>
          <input name='filter_name' placeholder='filter by name' type='text' onChange={this.handleFilterNameChange} value={this.state.filter_name} />
        </form>
        <table className='pure-table pure-table-horizontal'>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Shift Date</th>
              <th>Start Time</th>
              <th>Finish Time</th>
              <th>Break Length</th>
              <th>Hours Worked</th>
              <th>Shift Cost</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filtered_shifts?.map(shift => this.renderShift(shift))}
            <tr className='pure-form'>
              <td>{this.props.user?.name}</td>
              <td>
                <DatePicker placeholderText='shift start date' dateFormat="MM/dd/yyyy" selected={this.state.shift_date} onChange={this.setShiftDate} />
              </td>
              <td><input name='shift_start' placeholder='shift start time' type='text' onChange={this.handleChange} value={this.state.shift_start} /></td>
              <td><input name='shift_end' placeholder='shift end time' type='text' onChange={this.handleChange} value={this.state.shift_end} /></td>
              <td><input name='breaks' placeholder='break lengths' type='text' onChange={this.handleChange} value={this.state.breaks} /></td>
              <td colSpan={2}><button className='pure-button' type='submit' onClick={this.handleSubmit}>Create Shift</button></td>
            </tr>
          </tbody>
        </table>
        <div>
          {this.state.errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      </>
    );
  }
}

export default ShiftOverview;