import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  wrapper: {
    position: 'relative',
  },
  submitProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -12,
  },
  deleteButton: {
    top: theme.spacing(1),
    position: 'absolute',
    right: 0
  },
  toggleContainer: {
    margin: theme.spacing(2, 0),
  },
  toggleButton: {
    width: 50,
    [theme.breakpoints.down('xs')]: {
      width: 33,
    },
  },
  divider: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  weekDays: {
    width: '100%',
    justifyContent: 'space-between'
  },
}));

export default useStyles;