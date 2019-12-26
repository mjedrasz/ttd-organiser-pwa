import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { Logger } from '@aws-amplify/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import I18n from "@aws-amplify/core/lib/I18n";

import useStyles from './styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toast from '../Toast/Toast';
import { useForm } from '../../hooks/useForm';
import { useSubmit } from '../../hooks/useSubmit'; 
import { useToast } from '../../hooks/useToast';
import Auth from '../../services/Auth';
import * as AuthState from '../../constants/authStates';

const logger = new Logger('ConfirmSignUp');

export default (props) => {

  const classes = useStyles();

  const { useInput, values, setValues, isValid, preventValidation } = useForm();

  const [toast, showToast] = useToast();

  const confirmSignUp = async () => {
    try {
      const { email, code } = values;
      await Auth.confirmSignUp(email, code);
      props.onStateChange(AuthState.SIGN_IN, email);
    } catch (err) {
      logger.error("Confirm Sign up failed", err);
      showToast(I18n.get('Confirm Sign up failed'), 'error');
    }
  };

  const resendCode = async () => {
    try {
      const { email } = values;
      await Auth.resendCode(email);
      showToast(I18n.get('Operation succeeded'), 'success');
    } catch (err) {
      logger.error("Resending code failed", err);
      showToast(I18n.get('Resending code failed'), 'error');
    }
  };

  const [handleConfirmSignUp, submittingConfirmSignUp] = useSubmit(confirmSignUp);
  const [handleResendCode, submittingResendCode] = useSubmit(resendCode);

  const codeInput = useInput('code', '', {
    isRequired: I18n.get('The field is required'),
  });

  const emailInput = useInput('email', '', {
    isRequired: I18n.get('The field is required'),
    isEmail: I18n.get('Invalid e-mail format')
  });

  useEffect(() => {
    if (props.authData) {
      setValues({
        ...values,
        email: props.authData
      });
    }
  }, [props.authData]);

  const handleBackToSignIn = (evt) => {
    evt.preventDefault();
    props.onStateChange(AuthState.SIGN_IN);
  };

  return [AuthState.CONFIRM_SIGN_UP].includes(props.authState) && (
    <>
      <Toast {...toast} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {I18n.get("Confirm Signup")}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              disabled
              id="email"
              label={I18n.get("Email Address")}
              name="email"
              autoComplete="email"
              {...emailInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="code"
              label={I18n.get("Confirmation Code")}
              id="code"
              autoComplete="confirmation-code"
              autoFocus
              {...codeInput}
            />
            <div className={classes.wrapper}>
              <Button
                onClick={handleConfirmSignUp}
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid || submittingConfirmSignUp}
                className={classes.submit}
              >
                {I18n.get("Confirm")}
              </Button>
              {submittingConfirmSignUp && <CircularProgress size={24} className={classes.submitProgress} />}
            </div>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={handleResendCode} onMouseDown={preventValidation}>
                  {I18n.get("Lost your code? Resend Code")}
                  {submittingResendCode && <CircularProgress size={16} />}
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleBackToSignIn} onMouseDown={preventValidation}>
                  {I18n.get("Back to Sign In")}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        
      </Container>
    </>
  );
}