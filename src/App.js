import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
  isInclusivelyBeforeDay
} from 'react-dates';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      dates: []
    };
  }

  getDates = () => {
    let arr = [];
    let count = 0;
    while (
      moment(this.state.startDate)
        .add(count, 'd')
        .format('DD-MM-YYYY') !==
      moment(this.state.endDate).format('DD-MM-YYYY')
    ) {
      arr.push(
        moment(this.state.startDate)
          .add(count, 'd')
          .format('DD-MM-YYYY')
      );
      count++;
    }
    arr.push(moment(this.state.endDate).format('DD-MM-YYYY'));
    this.state.dates = arr;
    console.log(this.state.dates);

    //let fechita = moment(this.state.startDate).format('DD-MM-YYYY');
    //alert(fechita);
  };

  render() {
    return (
      <div className="App">
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) =>
            this.setState({ startDate, endDate })
          } // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          isOutsideRange={function noRefCheck() {}}
          minDate={moment().subtract(13, 'months')}
          maxDate={moment()}
          numberOfMonths={1}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
        />
        <button onClick={this.getDates}>click</button>
      </div>
    );
  }
}

export default App;
