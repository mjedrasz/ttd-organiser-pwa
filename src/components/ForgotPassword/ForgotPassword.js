import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Logger } from '@aws-amplify/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import I18n from "@aws-amplify/core/lib/I18n";

import useStyles from './styles';
import Toast from '../Toast/Toast';
import { useForm } from '../../hooks/useForm';
import { useSubmit } from '../../hooks/useSubmit'; 
import { useToast } from '../../hooks/useToast';
import Auth from '../../services/Auth';
import * as AuthState from '../../constants/authStates';

const logger = new Logger('ForgotPassword');

export default (props) => {

  const classes = useStyles();

  const { useInput, isValid, values } = useForm();

  const [toast, showToast] = useToast();

  const forgotPassword = async () => {
    try {
      const { email } = values;
      await Auth.forgotPassword(email);
      props.onStateChange(AuthState.RESET_PASSWORD, email);
    } catch (err) {
      logger.error("Forgot password failed", err);
      showToast(I18n.get('Forgot password failed'), 'error');
    }
  };

  const [handleForgotPassword, submittingForgotPassword] = useSubmit(forgotPassword);

  const emailInput = useInput('email', '', {
    isRequired: I18n.get('The field is required'),
    isEmail: I18n.get('Invalid e-mail format')
  });


  return [AuthState.FORGOT_PASSWORD].includes(props.authState) && (
    <>
      <Toast {...toast} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {I18n.get("Reset password")}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={I18n.get("Email Address")}
              name="email"
              autoComplete="email"
              autoFocus
              {...emailInput}
            />
            <div className={classes.wrapper}>
              <Button
                onClick={handleForgotPassword}
                fullWidth
                variant="contained"
                disabled={!isValid || submittingForgotPassword}
                color="primary"
                className={classes.submit}
              >
                {I18n.get("Submit")}
              </Button>
              {submittingForgotPassword && <CircularProgress size={24} className={classes.submitProgress} />}
            </div>
          </form>
        </div>
        
      </Container>
    </>
  );
}