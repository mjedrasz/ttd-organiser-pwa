import React from 'react';
import renderer from 'react-test-renderer';
import Schedule from './Schedule';
import * as WeekDay from '../../constants/weekDays';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

describe('Schedule', () => {

  test('snapshot renders correctly', () => {
    const occurrences = [{
      fromTime: new Date(2019, 10, 12, 14, 0, 0, 0),
      toTime: new Date(2019, 10, 12, 16, 0, 0, 0),
      days: [WeekDay.MON, WeekDay.WED]
    },
    {
      fromTime: new Date(2019, 10, 12, 18, 0, 0, 0),
      toTime: new Date(2019, 10, 12, 20, 0, 0, 0),
      days: [WeekDay.THU, WeekDay.FRI, WeekDay.SAT]
    }]
    const component = renderer.create(<MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Schedule
        schedule={occurrences}
        handleTimeChange={() => { }}
        handleDaysChange={() => { }}
        handleScheduleDelete={() => { }}
        disabled={false} />
    </MuiPickersUtilsProvider>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});