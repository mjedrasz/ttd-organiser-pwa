import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Logger } from '@aws-amplify/core';
import I18n from "@aws-amplify/core/lib/I18n";
import CircularProgress from '@material-ui/core/CircularProgress';
import Toast from '../Toast/Toast';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import useStyles from './styles';
import { useSubmit } from '../../hooks/useSubmit';
import Auth from '../../services/Auth';
import * as AuthState from '../../constants/authStates';

const logger = new Logger('SignOut');

export default (props) => {

  const classes = useStyles();

  const { useInput, isValid, values, preventValidation } = useForm();

  const [toast, showToast] = useToast();

  const signUp = async () => {
    try {
      const { name, email, password } = values;
      await Auth.signUp(email, password, { name });
      props.onStateChange(AuthState.CONFIRM_SIGN_UP, email);
    } catch (err) {
      logger.error("Sign up failed", err);
      showToast(I18n.get('Sign up failed'), 'error');
    }
  };

  const [handleSignUp, submittingSignUp] = useSubmit(signUp);

  const nameInput = useInput('name', '', {
    isRequired: I18n.get('The field is required'),
  });

  const emailInput = useInput('email', '', {
    isRequired: I18n.get('The field is required'),
    isEmail: I18n.get('Invalid e-mail format')
  });

  const passwordInput = useInput('password', '', {
    isRequired: I18n.get('The field is required'),
    isMinLength: { length: 8, message: I18n.get('The passwords must be at least 8 characters long') }
  });

  const signIn = (evt) => {
    evt.preventDefault();
    props.onStateChange(AuthState.SIGN_IN);
  };

  return [AuthState.SIGN_UP].includes(props.authState) && (
    <>
      <Toast {...toast} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {I18n.get("Sign up")}
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label={I18n.get("Name")}
                  autoFocus
                  {...nameInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label={I18n.get("Email Address")}
                  name="email"
                  autoComplete="email"
                  {...emailInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label={I18n.get("Password")}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...passwordInput}
                />
              </Grid>
            </Grid>
            <div className={classes.wrapper}>
              <Button
                data-testid="submit"
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isValid || submittingSignUp }
                className={classes.submit}
                onClick={handleSignUp}
              >
                {I18n.get("Sign Up")}
              </Button>
              {submittingSignUp && <CircularProgress size={24} className={classes.submitProgress} />}
            </div>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={signIn} onMouseDown={preventValidation}>
                  {I18n.get("Already have an account? Sign in")}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        
      </Container>
    </>
  );
}