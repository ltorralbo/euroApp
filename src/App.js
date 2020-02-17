import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Plot from 'react-plotly.js';
import axios from 'axios';
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
      dates: [],
      values: [],
      error: false,
      loading: null
    };
  }

  getDates = () => {
    this.setState({ loading: true });

    let arrValues = [];
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

    this.setState({ dates: arr });

    //let fechita = moment(this.state.startDate).format('DD-MM-YYYY');
    //alert(fechita);

    arr.map(date =>
      axios
        .get(`https://mindicador.cl/api/euro/${date}`)
        .then(response => {
          arrValues.push('' + response.data.serie[0].valor + '');
          this.setState({ values: arrValues });
        })
        .catch(error => {
          this.setState({ error: true });
        })
    );
    this.setState({ loading: false });
  };

  render() {
    let chart = <p>...</p>;

    if (
      this.state.loading === false &&
      this.state.values.length === this.state.dates.length
    ) {
      chart = (
        <Plot
          data={[
            {
              x: this.state.dates,
              y: this.state.values,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' }
            }
          ]}
          layout={{ width: 720, height: 440, title: 'Valor del euro' }}
        />
      );
    }

    return (
      <div className="App">
        <h2>Selecciona un período</h2>
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
        <div>
          {'  '}
          <br /> <button onClick={this.getDates}>Generar gráfico</button>
        </div>
        {'  '}
        <div>{chart}</div>
      </div>
    );
  }
}

export default App;
