import React, {Component, PropTypes} from 'react';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import transitions from '../styles/transitions';
import CalendarActionButtons from './CalendarActionButtons';
import CalendarMonth from './CalendarMonth';
import CalendarYear from './CalendarYear';
import CalendarToolbar from './CalendarToolbar';
import DateDisplay from './DateDisplay';
import SlideInTransitionGroup from '../internal/SlideIn';
import {
  RadioButton,
  RadioButtonGroup
} from '../RadioButton';

import {
  addDays,
  addMonths,
  addYears,
  cloneDate,
  dateTimeFormat,
  isAfterDate,
  isBeforeDate,
  getFirstDayOfMonth,
  localizedWeekday,
  monthDiff,
} from './dateUtils';


const hoursString = 
['12:00 AM - 01:00 AM',
 '01:00 AM - 02:00 AM',
 '02:00 AM - 03:00 AM',
 '03:00 AM - 04:00 AM',
 '04:00 AM - 05:00 AM',
 '05:00 AM - 06:00 AM',
 '06:00 AM - 07:00 AM',
 '07:00 AM - 08:00 AM',
 '08:00 AM - 09:00 AM',
 '09:00 AM - 10:00 AM',
 '10:00 AM - 11:00 AM',
 '11:00 AM - 12:00 PM',
    // After Noon 
 '12:00 PM - 01:00 PM',
 '01:00 PM - 02:00 PM',
 '02:00 PM - 03:00 AM',
 '03:00 PM - 04:00 PM',
 '04:00 PM - 05:00 PM',
 '05:00 PM - 06:00 PM',
 '06:00 PM - 07:00 PM',
 '07:00 PM - 08:00 PM',
 '08:00 PM - 09:00 PM',
 '09:00 PM - 10:00 PM',
 '10:00 PM - 11:00 PM',
 '11:00 PM - 12:00 PM',
];

const daysArray = [...Array(7)];
const hours = [...Array(24)];
hours.forEach((item,index)=>{
  hours[index] = {};
  hours[index].key = index;
  hours[index].value = hoursString[index];
});

class Calendar extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    hideCalendarDate: PropTypes.bool,
    initialDate: PropTypes.object,
    locale: PropTypes.string.isRequired,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onTouchTapCancel: PropTypes.func,
    onTouchTapDay: PropTypes.func,
    onTouchTapOk: PropTypes.func,
    open: PropTypes.bool,
    shouldDisableDate: PropTypes.func,
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    disableYearSelection: false,
    initialDate: new Date(),
    locale: 'en-US',
    minDate: addYears(new Date(), -100),
    maxDate: addYears(new Date(), 100),
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    displayDate: undefined,
    displayMonthDay: true,
    selectedDate: undefined,
    transitionDirection: 'left',
    transitionEnter: true,
    hours:hours
  };

  componentWillMount() {
    this.setState({
      displayDate: getFirstDayOfMonth(this.props.initialDate),
      selectedDate: this.props.initialDate,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialDate !== this.props.initialDate) {
      const date = nextProps.initialDate || new Date();
      this.setState({
        displayDate: getFirstDayOfMonth(date),
        selectedDate: date,
      });
    }
  }

  getSelectedDate() {
    return this.state.selectedDate;
  }

  isSelectedDateDisabled() {
    if (!this.state.displayMonthDay) {
      return false;
    }

    return this.refs.calendar.isSelectedDateDisabled();
  }

  addSelectedDays(days) {
    this.setSelectedDate(addDays(this.state.selectedDate, days));
  }

  addSelectedMonths(months) {
    this.setSelectedDate(addMonths(this.state.selectedDate, months));
  }

  addSelectedYears(years) {
    this.setSelectedDate(addYears(this.state.selectedDate, years));
  }

  setDisplayDate(date, newSelectedDate) {
    const newDisplayDate = getFirstDayOfMonth(date);
    const direction = newDisplayDate > this.state.displayDate ? 'left' : 'right';

    if (newDisplayDate !== this.state.displayDate) {
      this.setState({
        displayDate: newDisplayDate,
        transitionDirection: direction,
        selectedDate: newSelectedDate || this.state.selectedDate,
      });
    }
  }

  setSelectedDate(date) {
    let adjustedDate = date;
    if (isBeforeDate(date, this.props.minDate)) {
      adjustedDate = this.props.minDate;
    } else if (isAfterDate(date, this.props.maxDate)) {
      adjustedDate = this.props.maxDate;
    }

    const newDisplayDate = getFirstDayOfMonth(adjustedDate);
    if (newDisplayDate !== this.state.displayDate) {
      this.setDisplayDate(newDisplayDate, adjustedDate);
    } else {
      this.setState({
        selectedDate: adjustedDate,
      });
    }
  }

  handleTouchTapDay = (event, date) => {
    this.setSelectedDate(date);
    if (this.props.onTouchTapDay) this.props.onTouchTapDay(event, date);
  };

  handleMonthChange = (months) => {
    this.setState({
      transitionDirection: months >= 0 ? 'left' : 'right',
      displayDate: addMonths(this.state.displayDate, months),
    });
  };

  handleTouchTapYear = (event, year) => {
    const date = cloneDate(this.state.selectedDate);
    date.setFullYear(year);
    this.setSelectedDate(date, event);
    this.handleTouchTapDateDisplayMonthDay();
  };

  getToolbarInteractions() {
    return {
      prevMonth: monthDiff(this.state.displayDate, this.props.minDate) > 0,
      nextMonth: monthDiff(this.state.displayDate, this.props.maxDate) < 0,
    };
  }

  handleTouchTapDateDisplayMonthDay = () => {
    this.setState({
      displayMonthDay: true,
    });
  };

  handleTouchTapDateDisplayYear = () => {
    this.setState({
      displayMonthDay: false,
    });
  };

  handleWindowKeyDown = (event) => {
    if (this.props.open) {
      switch (keycode(event)) {
        case 'up':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(-1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(-1);
          } else {
            this.addSelectedDays(-7);
          }
          break;

        case 'down':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(1);
          } else {
            this.addSelectedDays(7);
          }
          break;

        case 'right':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(1);
          } else {
            this.addSelectedDays(1);
          }
          break;

        case 'left':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(-1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(-1);
          } else {
            this.addSelectedDays(-1);
          }
          break;
      }
    }
  };

  selectCompareValue = (event) =>{
    this.setState({
      selectedCompareValue: event.target.value
    },function(){
      this.props.selectCompareValue(this.state.selectedCompareValue);
    });
  }
  changeHour = (event) =>{
    this.setState({
      currentHour: event.target.value
    },function(){
        debugger;
        this.props.changeHour(this.state.currentHour);
    });
  }
  yearSelector() {
    if (!this.props.disableYearSelection) {
      return (
        <CalendarYear
          key='years'
          DateTimeFormat={this.props.DateTimeFormat}
          locale={this.props.locale}
          onTouchTapYear={this.handleTouchTapYear}
          selectedDate={this.state.selectedDate}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
        />
      );
    }
  }

  render() {
    const {prepareStyles} = this.context.muiTheme;
    const {hideCalendarDate} = this.props;
    const toolbarInteractions = this.getToolbarInteractions();
    const isLandscape = this.props.mode === 'landscape';
    const {calendarTextColor} = this.context.muiTheme.datePicker;

    const styles = {
      root: {
        color: calendarTextColor,
        userSelect: 'none',
        width: (!hideCalendarDate && isLandscape) ? 479 : 310,
      },
      calendar: {
        display: 'flex',
        flexDirection: 'column',
      },
      calendarContainer: {
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        flexDirection: 'column',
        fontSize: 12,
        fontWeight: 400,
        padding: '0px 8px',
        transition: transitions.easeOut(),
      },
      yearContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        marginTop: 10,
        overflow: 'hidden',
        width: 310,
      },
      weekTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontWeight: '500',
        height: 20,
        lineHeight: '15px',
        opacity: '0.5',
        textAlign: 'center',
      },
      weekTitleDay: {
        width: 42,
      },
      transitionSlide: {
        height: 214,
      },
    };

    const weekTitleDayStyle = prepareStyles(styles.weekTitleDay);

    const {
      minDate,
      maxDate,
      cancelLabel,
      DateTimeFormat,
      firstDayOfWeek,
      locale,
      okLabel,
      onTouchTapCancel, // eslint-disable-line no-unused-vars
      onTouchTapOk, // eslint-disable-line no-unused-vars
    } = this.props;

    return (
      <div style={prepareStyles(styles.root)}>
        <EventListener
          target='window'
          onKeyDown={this.handleWindowKeyDown}
        />
  {!hideCalendarDate &&
        <DateDisplay
          DateTimeFormat={DateTimeFormat}
          disableYearSelection={this.props.disableYearSelection}
          onTouchTapMonthDay={this.handleTouchTapDateDisplayMonthDay}
          onTouchTapYear={this.handleTouchTapDateDisplayYear}
          locale={locale}
          monthDaySelected={this.state.displayMonthDay}
          mode={this.props.mode}
          selectedDate={this.state.selectedDate}
        />
}
        <div style={prepareStyles(styles.calendar)} className='CalendarSelectionClass'>
          {this.state.displayMonthDay &&
            <div style={prepareStyles(styles.calendarContainer)}>
              <CalendarToolbar
                DateTimeFormat={DateTimeFormat}
                locale={locale}
                displayDate={this.state.displayDate}
                onMonthChange={this.handleMonthChange}
                prevMonth={toolbarInteractions.prevMonth}
                nextMonth={toolbarInteractions.nextMonth}
              />
              <div style={prepareStyles(styles.weekTitle)}>
                {daysArray.map((event, i) => (
                  <span key={i} style={weekTitleDayStyle}>
                    {localizedWeekday(DateTimeFormat, locale, i, firstDayOfWeek)}
                  </span>
                ))}
              </div>
              <SlideInTransitionGroup direction={this.state.transitionDirection} style={styles.transitionSlide}>
                <CalendarMonth
                  DateTimeFormat={DateTimeFormat}
                  locale={locale}
                  displayDate={this.state.displayDate}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  key={this.state.displayDate.toDateString()}
                  minDate={minDate}
                  maxDate={maxDate}
                  onTouchTapDay={this.handleTouchTapDay}
                  ref='calendar'
                  selectedDate={this.state.selectedDate}
                  shouldDisableDate={this.props.shouldDisableDate}
                />
              </SlideInTransitionGroup>
            </div>
          }
          { this.props.granularity == 'Hourly' &&
            <div style={{fontSize:'18px',fontFamily:'Bariol-Light',
            'marginLeft':'15px'}}>
              <div style={{float:'left',width:'30%'}}>Hours: </div>
              <div  style={{float:'left',width:'70%'}}>
                <select  name={'timeSelector'} onChange={this.changeHour} style={{marginLeft:'10px'}}>
                    {
                      this.state.hours.map((item,index) => {
                        return(
                          this.props.currentHour == item.key ?
                          <option key={index} value={item.key} selected>
                            {item.value}
                          </option>:
                        <option key={index} value={item.key}>
                          {item.value}
                        </option>
                        );
                      })
                    }
                  </select>
                </div>
              </div>
          }
          {this.props.hasCompareDate &&
            <div style={{fontSize:'18px',fontFamily:'Bariol-Light',
            'marginLeft':'15px'}}>
              <div style={{float:'left',width:'30%'}}>Compare With:</div>
              <div  style={{float:'left',width:'70%'}}>
                <select  name={'comparedToRadio'} style={{marginLeft:'10px'}}
                   onChange={this.selectCompareValue} >
                   {
                    this.props.compareValues.map((item) => {
                      return (
                        this.state.selectedCompareValue == item.value ?
                        <option value={item.value} label={item.label} selected
                            labelStyle={{fontFamily:'Bariol',fontSize:'16px'}} /> :
                         <option value={item.value} label={item.label}
                            labelStyle={{fontFamily:'Bariol',fontSize:'16px'}} />
                         )
                    })
                   }
                </select>
              </div>
            </div>
          }
          {!this.state.displayMonthDay &&
            <div style={prepareStyles(styles.yearContainer)}>
              {this.yearSelector()}
            </div>
          }
          {okLabel &&
            <CalendarActionButtons
              autoOk={this.props.autoOk}
              cancelLabel={cancelLabel}
              okLabel={okLabel}
              onTouchTapCancel={onTouchTapCancel}
              onTouchTapOk={onTouchTapOk}
            />
          }
        </div>
      </div>
    );
  }
}

export default Calendar;
{
  /*
  valueSelected={this.state.selectedCompareValue}
   defaultSelected={'previous_day'}
   */
}
