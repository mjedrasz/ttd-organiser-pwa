import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { Logger } from '@aws-amplify/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import I18n from "@aws-amplify/core/lib/I18n";

import Toast from '../Toast/Toast';
import useStyles from './styles';
import { useForm } from '../../hooks/useForm';
import GoogleIcon from './GoogleIcon'
import FacebookIcon from '@material-ui/icons/Facebook';
import { useSubmit } from '../../hooks/useSubmit';
import { useToast } from '../../hooks/useToast';
import Auth from '../../services/Auth';
import * as AuthState from '../../constants/authStates';

const logger = new Logger('SignIn');

export default (props) => {

  const classes = useStyles();

  const { values, setValues, useInput, isValid, preventValidation} = useForm();
  
  const [toast, showToast] = useToast();

  const signIn = async () => {
    const { email, password } = values;
    try {
      const { state, data } = await Auth.signIn(email, password);
      props.onStateChange(state, data);
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        props.onStateChange(AuthState.CONFIRM_SIGN_UP, email);
      } else {
        logger.error("signin in failed", err);
        showToast(I18n.get('Sign in failed'), 'error');
      }
    };
  };

  const [handleSignIn, submittingSignIn] = useSubmit(signIn);

  const emailInput = useInput('email', '', {
    isRequired: I18n.get('The field is required'),
    isEmail: I18n.get('Invalid e-mail format')
  });

  const passwordInput = useInput('password', '', {
    isRequired: I18n.get('The field is required')
  });

  useEffect(() => {
    if (props.authData) {
      setValues({
        ...values,
        email: props.authData
      });
    }
  }, [props.authData, setValues, values]);

  const handleSignUp = (evt) => {
    evt.preventDefault();
    props.onStateChange(AuthState.SIGN_UP);
  };

  const handleForgotPassword = (evt) => {
    evt.preventDefault();
    props.onStateChange(AuthState.FORGOT_PASSWORD);
  };

  return [AuthState.SIGN_IN].includes(props.authState) && (
    <>
      <Toast {...toast} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {I18n.get("Sign in")}
          </Typography>
          <form className={classes.form} noValidate>
            <Button variant="contained" color="primary"
              className={classes.social}
              fullWidth
              onClick={Auth.googleSignIn}
              onMouseDown={preventValidation}
              data-amplify-analytics-on='click'
              data-amplify-analytics-name='sign-in-options.google'>
              <GoogleIcon />
              {I18n.get('Continue with Google')}
            </Button>
            <Button variant="contained" color="primary"
              className={classes.social}
              fullWidth
              onClick={Auth.facebookSignIn}
              onMouseDown={preventValidation}
              data-amplify-analytics-on='click'
              data-amplify-analytics-name='sign-in-options.google'>
              <FacebookIcon />
              {I18n.get('Continue with Facebook')}
            </Button>
            <Typography variant="body2" className={classes.orSeparator}>
              {I18n.get('or')}
            </Typography>
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={I18n.get("Password")}
              type="password"
              id="password"
              autoComplete="current-password"
              {...passwordInput}
            />
            <div className={classes.wrapper}>
              <Button
                data-testid="submit"
                label="Sign in"
                onClick={handleSignIn}
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid || submittingSignIn}
                className={classes.submit}
              >
                {I18n.get("Sign in")}
              </Button>
              {submittingSignIn && <CircularProgress size={24} className={classes.submitProgress} />}
            </div>
            <Grid container>
              <Grid item xs>
                <Typography variant="body2">
                  {I18n.get("No account? ")}
                  <Link href="#" variant="body2" onClick={handleSignUp} onMouseDown={preventValidation}>
                    {I18n.get("Sign Up")}
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleForgotPassword} onMouseDown={preventValidation}>
                  {I18n.get("Forgot password?")}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        
      </Container>
    </>
  );
}