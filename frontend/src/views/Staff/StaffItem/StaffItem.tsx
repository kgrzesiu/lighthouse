import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addNew, changeItem, loadItem, updateItem} from "redux/actions/staffAction";


interface IStaffItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const StaffItem = (props: IStaffItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const staffId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;

    const staffItem  = useSelector((state: any)=> state.staff.staffItem);
    //const isLoading = useSelector((state: any) => state.staff.isLoading);
    //const errorValue = useSelector((state: any) => state.staff.error);
    const hasError = useSelector((state: any) => state.staff.hasError)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = {...staffItem, [event.target.name]: event.target.value};
        dispatch(changeItem(raw))
    };

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.MouseEvent) => {
        if (staffId === 0) {
            dispatch(addNew(staffItem));
        } else {
            dispatch(updateItem(staffItem));
        }
        if (!hasError) history.push('/org/staff');
    };

    useEffect( ()=> {
            if (staffId !== 0) dispatch(loadItem(staffId));
        }, [dispatch]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
                    <CardHeader
                        subheader=""
                        title="Должность"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Наименование должности"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={staffItem.name}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={saveHandler}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/org/staff'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default StaffItem;
