import React from 'react';
import renderer from 'react-test-renderer';
import ThingToDoInputForm from './ThingToDoInputForm';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { RECURRING_EVENT } from '../../constants/thingToDoTypes';

jest.mock('../AutoComplete/AutoComplete', () =>
  jest.fn(() => (
    <div>
      Address
    </div>
  )));

describe('ThingToDoInputForm', () => {

  test('snapshot renders correctly', () => {
    const defaults = {
      thingToDoType: RECURRING_EVENT,
      target: [],
      category: '',
      bookingMandatory: false,
      adultMandatory: false,
      age: [0, 100],
      price: [0, 0],
      coordinates: {},
      fromDate: new Date(2019, 10, 12, 14, 0, 0, 0),
      toDate: new Date(2019, 10, 12, 16, 0, 0, 0),
      schedule: [],
      image: null,
      address: ''
    };

    const form = {
      values: defaults,
      useInput: jest.fn(() => ({ helperText: '' }))
    };

    const component = renderer.create(<MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThingToDoInputForm
        form={form}
        disabled={false} />
    </MuiPickersUtilsProvider>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});