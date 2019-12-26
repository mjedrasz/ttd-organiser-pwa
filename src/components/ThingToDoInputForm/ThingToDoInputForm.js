import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import { useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Logger } from '@aws-amplify/core';
import I18n from '@aws-amplify/core/lib/I18n';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import GoogleMaps from '../AutoComplete/AutoComplete';
import Schedule from '../Schedule/Schedule';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TitledSection from '../TitledSection/TitledSection';
import { DateTimePicker } from '@material-ui/pickers';
import useStyles from './styles';
import * as Category from '../../constants/categories';
import * as Target from '../../constants/targets';
import * as ThingToDoType from '../../constants/thingToDoTypes';


const required = {
  isRequired: I18n.get('The field is required'),
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default ({ form, disabled }) => {

  const classes = useStyles();
  const theme = useTheme();

  const disabledOpts = {
    disabled: disabled || false
  };

  const { useInput, values, setValues } = form;

  const handleDaysChange = (index) => (_, newDays) => {
    const newSchedule = {
      ...values.schedule[index],
      days: newDays
    };
    setValues({
      ...values,
      schedule: [
        ...values.schedule.slice(0, index),
        newSchedule,
        ...values.schedule.slice(index + 1)
      ]
    });

  };

  const handleTimeChange = (index, name) => (newDate) => {
    const newSchedule = {
      ...values.schedule[index],
      [name]: newDate
    };
    setValues({
      ...values,
      schedule: [
        ...values.schedule.slice(0, index),
        newSchedule,
        ...values.schedule.slice(index + 1)
      ]
    });

  };

  const handleScheduleDelete = (index) => () => {
    setValues({
      ...values,
      schedule: [
        ...values.schedule.slice(0, index),
        ...values.schedule.slice(index + 1)
      ]
    });

  };

  const handleAddOccurrence = async () => {
    setValues({
      ...values,
      schedule: values.schedule.concat({
        fromTime: new Date(),
        toTime: new Date(),
        days: []
      })
    })
  };

  const handleThingToDoTypeChange = (evt) => {
    setValues({
      ...values,
      thingToDoType: evt.target.value
    });
  }

  const handleCheckboxChange = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleSelectChange = name => (evt) => {
    setValues({
      ...values,
      [name]: evt.target.value
    });
  }

  const handleImageChange = (evt) => {
    const { target: { files } } = evt;
    const [file,] = files || [];
    setValues({
      ...values,
      image: file
    });
  }

  const handleChange = name => value => {
    setValues({
      ...values,
      [name]: value
    })
  }

  const addressInput = useInput('address', '', required);

  const targetInput = useInput('target', '', {
    isEmpty: 'The field is required'
  });

  const categoryInput = useInput('category', '', {
    isEmpty: 'The field is required'
  });

  const handleAddressChange = ({ address, coordinates }) => {
    setValues({ ...values, coordinates, address });
  };

  const nameInput = useInput('name', '', required);

  const descriptionInput = useInput('description', '', {
    isRequired: I18n.get('The field is required'),
    isMaxLength: { length: 1000, message: I18n.get('The description might be maximum 1000 characters long') }
  });

  const handleRangeChange = name => (_, newValue) => {
    setValues({
      ...values,
      [name]: newValue
    });
  };

  const emailInput = useInput('email', '', {
    isRequired: I18n.get('The field is required'),
    isEmail: I18n.get('Invalid e-mail format')
  });

  const phoneInput = useInput('phone', '', required);

  const wwwInput = useInput('www', '', required);

  return (
    <Container component='main' maxWidth='sm'>
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          <TitledSection title={I18n.get('Basic information')}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete='name'
                  name='name'
                  variant='outlined'
                  required
                  fullWidth
                  id='name'
                  label={I18n.get('Name')}
                  autoFocus
                  {...nameInput}
                  {...disabledOpts}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component='fieldset' className={classes.formControl}>
                  <RadioGroup row aria-label='thingToDoType' name='thingToDoType' value={values.thingToDoType}
                    onChange={handleThingToDoTypeChange} >
                    <FormControlLabel value={ThingToDoType.EVENT} control={<Radio />} label={ThingToDoType.labels.EVENT} {...disabledOpts} />
                    <FormControlLabel value={ThingToDoType.RECURRING_EVENT} control={<Radio />} label={ThingToDoType.labels.RECURRING_EVENT} {...disabledOpts} />
                    <FormControlLabel value={ThingToDoType.PLACE} control={<Radio />} label={ThingToDoType.labels.PLACE} {...disabledOpts} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  id='description'
                  label={I18n.get('Description')}
                  name='description'
                  multiline
                  rows='4'
                  {...descriptionInput}
                  {...disabledOpts}
                />
              </Grid>
              <Grid item xs={12}>
                <GoogleMaps addressInput={addressInput}
                  onAddressChange={handleAddressChange} {...disabledOpts} />
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl} fullWidth error={targetInput.helperText !== ''}>
                  <InputLabel>{I18n.get('Target type')}</InputLabel>
                  <Select
                    multiple
                    value={values.target}
                    onChange={handleSelectChange('target')}
                    input={<Input fullWidth onChange={targetInput.onChange}
                    onFocus={targetInput.onFocus} onBlur={targetInput.onBlur}/>}
                    renderValue={selected => (
                      <div className={classes.chips}>
                        {selected.map(target => (
                          <Chip key={target} label={Target.labels[target]} className={classes.chip} />
                        ))}
                      </div>
                    )}
                    {...disabledOpts}
                  >
                    {Target.keys.map(target => (
                      <MenuItem key={target} value={target} style={getStyles(target, values.target, theme)}>
                        {Target.labels[target]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{targetInput.helperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl} fullWidth error={categoryInput.helperText !== ''} >
                  <InputLabel>{I18n.get('Category')}</InputLabel>
                  <Select
                    value={values.category}
                    onChange={handleSelectChange('category')}
                    input={<Input fullWidth onChange={categoryInput.onChange}
                    onFocus={categoryInput.onFocus} onBlur={categoryInput.onBlur} value={categoryInput.value}/>}
                    {...disabledOpts}
                  >
                    {Category.keys.map(cat => (
                      <MenuItem key={cat} value={cat} style={getStyles(cat, values.category, theme)}>
                        {Category.labels[cat]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{categoryInput.helperText}</FormHelperText>

                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox checked={values.bookingMandatory} onChange={handleCheckboxChange('bookingMandatory')}
                        value={values.bookingMandatory} {...disabledOpts} />
                    }
                    label={I18n.get('Booking mandatory')}
                  /></FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox checked={values.adultMandatory} onChange={handleCheckboxChange('adultMandatory')}
                        value={values.adultMandatory} {...disabledOpts} />
                    }
                    label={I18n.get('Adult mandatory')}
                  /></FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography id='range-slider' gutterBottom>
                  {I18n.get("Age range")}
                </Typography>
                <Slider
                  value={values.age}
                  onChange={handleRangeChange('age')}
                  valueLabelDisplay='auto'
                  aria-labelledby='range-slider'
                  getAriaValueText={value => `${value}${I18n.get("year(s)")}`}
                  {...disabledOpts}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography id='range-slider' gutterBottom>
                  {I18n.get("Price range")}
                </Typography>
                <Slider
                  value={values.price}
                  onChange={handleRangeChange('price')}
                  valueLabelDisplay='auto'
                  aria-labelledby='range-slider'
                  getAriaValueText={(value) => `${value}${I18n.get("$")}`}
                  {...disabledOpts}
                />
              </Grid>
              <Grid container spacing={2} direction="row" alignItems="center">

                <Grid item>
                  <input
                    accept="image/*"
                    onChange={handleImageChange}
                    className={classes.fileInput}
                    id="contained-button-file"
                    type="file"
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" color="secondary" component="span" {...disabledOpts}>
                      {I18n.get("Upload image")}
                    </Button>
                  </label>
                </Grid>
                <Grid item>
                  <Typography id='range-slider' gutterBottom>
                    {values.image && values.image.name || ''}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </TitledSection>
          <TitledSection title={I18n.get('Contact information')}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='email'
                  label={I18n.get('Email address')}
                  id='email'
                  {...emailInput}
                  {...disabledOpts}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='phone'
                  label={I18n.get('Phone')}
                  id='phone'
                  {...phoneInput}
                  {...disabledOpts}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='www'
                  label={I18n.get('Web site')}
                  id='www'
                  {...wwwInput}
                  {...disabledOpts}
                />
              </Grid>
            </Grid>
          </TitledSection>
          <TitledSection title={I18n.get('When')}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DateTimePicker fullWidth value={values.fromDate} onChange={handleChange('fromDate')}
                  inputVariant='outlined'
                  label={I18n.get('From')}
                  {...disabledOpts} />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker fullWidth value={values.toDate} onChange={handleChange('toDate')}
                  inputVariant='outlined'
                  label={I18n.get('To')}
                  {...disabledOpts} />
              </Grid>
            </Grid>
          </TitledSection>
          {
            values.thingToDoType !== ThingToDoType.EVENT && <TitledSection title={I18n.get('Schedule')}>
              <Grid container spacing={2} justify='center' direction='row'>
                <Grid item xs={12} >
                  <Schedule schedule={values.schedule} handleTimeChange={handleTimeChange} handleDaysChange={handleDaysChange}
                    handleScheduleDelete={handleScheduleDelete} {...disabledOpts} />
                </Grid>
                <Grid item>
                  <Fab color='secondary' size='small' aria-label='add' onClick={handleAddOccurrence} {...disabledOpts}>
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
            </TitledSection>
          }
        </form>
      </div>
    </Container >
  );
};
