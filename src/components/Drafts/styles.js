import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 1
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    wrapper: {
        position: 'relative',
    },
    add: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -28,
        marginLeft: -28,
    },
    dialog: {
        margin: 16
    },
    skeletonActions: {
        padding: theme.spacing(1.5, 2)
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2, 0),
        height: '100%',
        width: '100%',
        overflowY: "hidden",
        overflowX: "hidden"
        // overflow: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
    submitProgress: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -8,
        marginLeft: -12,
    },
}));

export default useStyles;