import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import I18n from '@aws-amplify/core/lib/I18n';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/lab/Skeleton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import { format, utcToZonedTime } from 'date-fns-tz';
import uuidv4 from 'uuid/v4';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddThingToDo from '../AddThingToDo/AddThingToDo';
import EditThingToDo from '../EditThingToDo/EditThingToDo';
import ViewThingToDo from '../ViewThingToDo/ViewThingToDo';
import useStyles from './styles';
import { useForm } from '../../hooks/useForm';
import { RECURRING_EVENT } from '../../constants/thingToDoTypes';
import { useMutation, useQuery } from '@apollo/react-hooks';
import CreateThingToDoMutation from '../../graphQL/CreateThingToDoMutation';
import ThingsToDoByStatusQuery from '../../graphQL/ThingsToDoByStatusQuery';
import UpdateThingToDoMutation from '../../graphQL/UpdateThingToDoMutation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Auth, Storage } from 'aws-amplify';
import settings from '../../settings';
import { useToast } from '../../hooks/useToast';
import { useSubmit } from '../../hooks/useSubmit';
import { Logger } from '@aws-amplify/core';
import Toast from '../Toast/Toast';

const logger = new Logger('Cards');

const defaults = {
    thingToDoType: RECURRING_EVENT,
    target: [],
    category: '',
    bookingMandatory: false,
    adultMandatory: false,
    age: [0, 100],
    price: [0, 0],
    coordinates: {},
    fromDate: new Date(),
    toDate: new Date(),
    schedule: [],
    image: null,
    address: ''
};

export default () => {
    const classes = useStyles();

    const [after, setAfter] = React.useState(null);
    const [createThingToDo] = useMutation(CreateThingToDoMutation,
        {
            update(cache, { data: { createThingToDo } }) {
                const { thingsToDoByStatus } = cache.readQuery({
                    query: ThingsToDoByStatusQuery,
                    variables: { status: 'DRAFT', after }
                });
                const updated = [
                    ...thingsToDoByStatus.edges,
                    {
                        __typename: 'ThingToDoEdge',
                        node: {
                            __typename: 'ThingToDoEdge',
                            ...createThingToDo
                        }
                    },
                ];
                cache.writeQuery({
                    query: ThingsToDoByStatusQuery,
                    variables: { status: 'DRAFT', after },
                    data: {
                        thingsToDoByStatus: {
                            __typename: thingsToDoByStatus.__typename,
                            edges: updated,
                            pageInfo: thingsToDoByStatus.pageInfo
                        }
                    },
                });
            }
        });

    const [updateThingToDo] = useMutation(UpdateThingToDoMutation);

    const [more, setMore] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [view, setView] = React.useState(false);
    const [add, setAdd] = React.useState(false);

    const form = useForm();
    const [toast, showToast] = useToast();

    const { loading: loadingItems, data, fetchMore } = useQuery(ThingsToDoByStatusQuery, {
        variables: { status: 'DRAFT', after: null }
    });

    const handleClickAdd = () => {
        form.setValues({ ...defaults });
        setAdd(true);
        setOpen(true);
    };

    const imageUpload = async (selectedFile) => {
        try {
            const user = await Auth.currentUserInfo();
            const { name, type: mimeType } = selectedFile;
            const key = `${user.id}/images/${uuidv4()}${name}`;

            await Storage.put(key, selectedFile, {
                level: 'public',
                contentType: mimeType
            });
            return {
                name,
                bucket: settings.assetsBucket,
                key: `public/${key}`,
                region: settings.region,
                mimeType
            };
        } catch (e) {
            logger.error('Image upload failed', e);
            return null;
        }
    };

    const handleClickEdit = (id) => () => {
        form.setValues({ id, ...defaults });
        setEdit(true);
        setOpen(true);
    };

    const handleClickView = (id) => () => {
        form.setValues({ id, ...defaults });
        setView(true);
        setOpen(true);
    };


    const LoadingSkeletion = (id) => (
        <Grid key={id} item xs={12} sm={5} md={3} className={classes.card}  >
            <Card className={classes.card}>
                <Skeleton variant="rect" className={classes.cardMedia} width="100%" />
                <CardContent className={classes.cardContent} >
                    <Typography gutterBottom variant="h5" component="h2" noWrap component="div">
                        <Skeleton width="60%" />
                    </Typography>
                    <Typography noWrap component="div">
                        <Skeleton />
                    </Typography>
                </CardContent>
                <CardActions className={classes.skeletonActions}>
                    <Skeleton width="20%" height="22px" />
                    <Skeleton width="20%" height="22px" />
                </CardActions>
            </Card>
        </Grid>
    );

    const addTile = (
        <Grid item key='add' xs={12} sm={5} md={3} className={classes.card}>
            <Card className={classes.card}>
                <div className={classes.wrapper}>
                    <Skeleton variant="rect" className={classes.cardMedia} width="100%" disableAnimate />
                    <Fab color='primary' size='large' aria-label='add' onClick={handleClickAdd} className={classes.add}>
                        <AddIcon />
                    </Fab>
                </div>
                <CardContent className={classes.cardContent} >
                    <Typography gutterBottom variant="h5" component="h2" noWrap component="div">
                        <Skeleton width="60%" disableAnimate />
                    </Typography>
                    <Typography noWrap component="div">
                        <Skeleton disableAnimate />
                    </Typography>
                </CardContent>
                <CardActions className={classes.skeletonActions}>
                    <Skeleton width="20%" height="22px" disableAnimate />
                    <Skeleton width="20%" height="22px" disableAnimate />
                </CardActions>
            </Card>
        </Grid>
    )

    const events = loadingItems ? [] : data && data.thingsToDoByStatus.edges || [];
    const pageInfo = loadingItems ? {} : data && data.thingsToDoByStatus.pageInfo || {};


    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setAdd(false);
        setView(false);
    };

    const toGraphQlModel = (form) => ({
        name: form.values.name,
        description: form.values.description,
        type: form.values.thingToDoType,
        category: form.values.category,
        bookingMandatory: form.values.bookingMandatory,
        adultMandatory: form.values.adultMandatory,
        target: { age: { from: form.values.age[0], to: form.values.age[1] }, type: form.values.target },
        price: { from: form.values.price[0], to: form.values.price[1] },
        contact: { email: form.values.email, phone: form.values.phone, www: form.values.www },
        where: {
            address: form.values.address,
            location: form.values.coordinates
        },
        when: {
            dateTime: {
                from: form.values.fromDate.toISOString(),
                to: form.values.toDate.toISOString()
            },
            occurrences: form.values.schedule.flatMap(s => s.days.map(d => ({
                hours: {
                    from: format(utcToZonedTime(s.fromTime, 'UTC'), "HH:mm:ss'Z'"),
                    to: format(utcToZonedTime(s.toTime, 'UTC'), "HH:mm:ss'Z'")
                },
                dayOfWeek: d
            })))
        }
    });

    const addThingToDo = async () => {
        let image = null;
        if (form.values.image && form.values.image.size > 0) {
            image = await imageUpload(form.values.image);
            if (!image) {
                showToast(I18n.get('Image upload failed'), 'error');
                return;
            }
        }
        try {
            const input = { ...toGraphQlModel(form), image };
            await createThingToDo({
                variables: { input }
            });
            setOpen(false)
            setAdd(false)
        } catch (e) {
            logger.error('Add failed', e);
            showToast(I18n.get('Add failed'), 'error');
        }
    }

    const editThingToDo = async () => {
        let image = null;
        if (form.values.image && form.values.image.size > 0) {
            image = await imageUpload(form.values.image);
            if (!image) {
                showToast(I18n.get('Image upload failed'), 'error');
                return;
            }
        }
        const input = {
            id: form.values.id,
            thingToDo: { ...toGraphQlModel(form), image }
        };
        try {
            await updateThingToDo({ variables: { ...input } });
            setOpen(false)
            setEdit(false);
        } catch (e) {
            logger.error('Update failed', e);
            showToast(I18n.get('Update failed'), 'error');
        }
    }

    const [handleAddThingToDo, submittingAddThingToDo] = useSubmit(addThingToDo);
    const [handleEditThingToDo, submittingEditThingToDo] = useSubmit(editThingToDo);

    const handleDialogClick = async (evt) => {
        if (add)
            await handleAddThingToDo(evt);
        else {
            await handleEditThingToDo(evt);
        }
    }
    return (
        <main className={classes.content}>
            <Toast {...toast} />
            <Container maxWidth="xl" >
                <Dialog open={open} onClose={handleClose} classes={{ paper: classes.dialog }} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        {I18n.get('Add new thing todo')}
                    </DialogTitle>
                    {add && <AddThingToDo form={form} />}
                    {edit && <EditThingToDo form={form} />}
                    {view && <ViewThingToDo form={form} />}
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" onMouseDown={form.preventValidation}>
                            {!view ? I18n.get("Cancel") : I18n.get("Close")}
                        </Button>
                        {!view &&
                            <div className={classes.wrapper}>
                                <Button onClick={handleDialogClick} color="primary" variant='contained'
                                    disabled={!form.isValid || submittingAddThingToDo || submittingEditThingToDo}>
                                    {!edit ? I18n.get("Add") : I18n.get("Edit")}
                                </Button>
                                {(submittingEditThingToDo || submittingAddThingToDo) &&
                                    <CircularProgress size={24} className={classes.submitProgress} />}
                            </div>
                        }
                    </DialogActions><div className={classes.appBarSpacer} />
                </Dialog>
                <InfiniteScroll style={{ overflow: 'hidden' }}
                    dataLength={[1].concat(events).length}
                    next={() => {
                        setMore(true);
                        setAfter(data.thingsToDoByStatus.pageInfo.endCursor);
                        const result = fetchMore({
                            variables: {
                                after: data.thingsToDoByStatus.pageInfo.endCursor
                            },
                            updateQuery: (previousResult, { fetchMoreResult }) => {
                                const newEdges = fetchMoreResult.thingsToDoByStatus.edges;
                                const pageInfo = fetchMoreResult.thingsToDoByStatus.pageInfo;
                                setMore(false);
                                return newEdges.length
                                    ? {
                                        thingsToDoByStatus: {
                                            __typename: previousResult.thingsToDoByStatus.__typename,
                                            edges: [...previousResult.thingsToDoByStatus.edges, ...newEdges],
                                            pageInfo
                                        }
                                    }
                                    : previousResult;
                            }
                        });

                        return result;
                    }}
                    scrollThreshold={0.8}
                    hasMore={pageInfo.hasNextPage === true}
                >

                    <div className={classes.appBarSpacer} />
                    <Grid container spacing={4} >
                        {loadingItems && [addTile].concat([1, 2, 3, 4, 5, 6, 7, 8].map(c => (<LoadingSkeletion key={c} />)))}
                        {!loadingItems && [addTile].concat(events.map(card => (
                            <Grid className={classes.card} item key={card.node.id} xs={12} sm={4} md={3} >
                                <Card className={classes.card}>
                                    {card.node.image ?
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={card.node.image.imageUri}
                                            title={card.node.image.name}
                                        /> :
                                        <Skeleton variant="rect" disableAnimate className={classes.cardMedia} width="100%" />}
                                    <CardContent className={classes.cardContent} >
                                        <Typography gutterBottom variant="h5" component="h2" noWrap>
                                            {card.node.name}
                                        </Typography>
                                        <Typography noWrap>
                                            {card.node.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={handleClickView(card.node.id)}>
                                            {I18n.get("View")}
                                        </Button>
                                        <Button size="small" color="primary" onClick={handleClickEdit(card.node.id)}>
                                            {I18n.get("Edit")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>)).concat([more && <LoadingSkeletion key='more' />]))}
                    </Grid>

                </InfiniteScroll>
            </Container>
        </main>
    );
};