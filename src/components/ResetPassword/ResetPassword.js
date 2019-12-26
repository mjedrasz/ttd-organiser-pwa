import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { Logger } from '@aws-amplify/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import I18n from "@aws-amplify/core/lib/I18n";
import useStyles from './styles';
import Toast from '../Toast/Toast';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { useSubmit } from '../../hooks/useSubmit';
import Auth from '../../services/Auth';
import * as AuthState from '../../constants/authStates';

const logger = new Logger('ResetPassword');

export default (props) => {

  const classes = useStyles();

  const { useInput, isValid, values, preventValidation } = useForm();

  const [toast, showToast] = useToast();

  const resendCode = async () => {
    try {
      await Auth.resendCode(props.authData);
      showToast(I18n.get('Operation succeeded'), 'success');
    } catch (err) {
      logger.error("Resend code failed", err);
      showToast(I18n.get('Resend code failed'), 'error');
    }
  };

  const resetPassword = async () => {
    try {
      const { code, password } = values;
      await Auth.resetPassword(props.authData, code, password);
      props.onStateChange(AuthState.SIGN_IN, props.authData);
    } catch (err) {
      logger.error("Reset password failed", err);
      showToast(I18n.get('Reset password failed'), 'error');
    }
  };

  const [handleResetPassword, submittingResetPassword] = useSubmit(resetPassword);
  const [handleResendCode, submittingResendCode] = useSubmit(resendCode);

  const codeInput = useInput('code', '', {
    isRequired: I18n.get('The field is required')
  });

  const passwordInput = useInput('password', '', {
    isRequired: I18n.get('The field is required'),
    isMinLength: { length: 8, message: I18n.get('The passwords must be at least 8 characters long') }
  });

  return [AuthState.RESET_PASSWORD].includes(props.authState) && (
    <>
      <Toast {...toast}/>
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
              name="confirmation-code"
              type="text"
              label={I18n.get("Confirmation Code")}
              autoComplete="off"
              id="confirmation-code"
              {...codeInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="new-password"
              label={I18n.get("New password")}
              type="password"
              id="new-password"
              autoComplete="off"
              {...passwordInput}
            />
            <div className={classes.wrapper}>
              <Button
                onClick={handleResetPassword}
                fullWidth
                disabled={!isValid || submittingResetPassword}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {I18n.get("Verify")}
              </Button>
              {submittingResetPassword && <CircularProgress size={24} className={classes.submitProgress} />}
            </div>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={handleResendCode} onMouseDown={preventValidation}>
                  {I18n.get("Lost your code? Resend Code")}
                  {submittingResendCode && <CircularProgress size={16} />}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        
      </Container>
    </>
  );
}