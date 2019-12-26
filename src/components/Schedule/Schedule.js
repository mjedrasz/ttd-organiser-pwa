import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import { Logger } from '@aws-amplify/core';
import I18n from "@aws-amplify/core/lib/I18n";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import * as WeekDay from '../../constants/weekDays';
import { TimePicker } from '@material-ui/pickers';
import useStyles from './styles';


export default ({ schedule, handleTimeChange, handleDaysChange, handleScheduleDelete, disabled }) => {

  const classes = useStyles();

  const weekDays = WeekDay.keys.map((day) => (
    <ToggleButton key={day} value={day} className={classes.toggleButton} disabled={disabled}>
      <Typography variant="caption">{WeekDay.labels[day]}</Typography>
    </ToggleButton>));

  return (
    <>
      {schedule.map((time, index) => (
        <div key={index} className={classes.wrapper}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TimePicker value={time.fromTime} onChange={handleTimeChange(index, 'fromTime')}
                inputVariant="outlined"
                label={I18n.get("From")}
                disabled={disabled} />
            </Grid>
            <Grid item xs={8}>
              <TimePicker value={time.toTime} onChange={handleTimeChange(index, 'toTime')}
                inputVariant="outlined"
                
                label={I18n.get("To")}
                disabled={disabled} />
            </Grid>
            <Grid item xs={6}>
              <ToggleButtonGroup size="small" value={time.days} onChange={handleDaysChange(index)}>
                {weekDays}
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid></Grid>
          <Fab color='secondary' size='small' className={classes.deleteButton} aria-label='add'
            onClick={handleScheduleDelete(index)}
            disabled={disabled}>
            <DeleteIcon />
          </Fab>
        </div>
      ))}
    </>
  );
};
