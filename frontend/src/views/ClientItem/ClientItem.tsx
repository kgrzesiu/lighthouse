import React, {useState, useEffect, SyntheticEvent} from 'react';
import moment from "moment";
import 'moment/locale/ru';
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
import {
    addNewClient,
    changeClientItem,
    loadClientContracts,
    loadClientItem,
    updateClient
} from "redux/actions/clientAction";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import {
    deleteTeamItem,
    getProductionCalc,
    getProductionTare,
    getProductionTeam,
    updateTeamItem
} from "../../redux/actions/productionAction";
import TabPanel from "../Production/components/TabPanel";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ProductionTeamItem from "../Production/components/ProductionTeamItem";
import ClientContractItem from "./components/ClientContractItem";
import {IProductionTeam} from "../../types/model/production";
import {useConfirm} from "material-ui-confirm";

const PAGE_MAIN = 0;
const PAGE_CONTRACT = 1;

interface IClientItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center'
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
}));


const ClientItem = (props: IClientItemProps) => {
    const paramId = props.match.params.id;
    const clientId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const clientItem = useSelector((state: IStateInterface) => state.client.clientItem);
    const contracts = useSelector((state: IStateInterface) => state.client.contracts);
    const hasError = useSelector((state: IStateInterface)=> state.client.hasError);
    const [tab, setTab] = React.useState(0);

    /**
     * Изменение вкладки
     * @param event
     * @param newValue - Индекс новой вкладки
     */
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
        switch (newValue) {
            case PAGE_MAIN:  break;
            case PAGE_CONTRACT: if (contracts.length === 0 ) {dispatch(loadClientContracts(clientId))} break;
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...clientItem, [event.target.name]: event.target.value};
        dispatch(changeClientItem(item))
    };

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        if (clientId === 0) {
            await dispatch(addNewClient(clientItem));
        } else {
            await dispatch(updateClient(clientItem));
        }
        resolve();
    });

    /**
     * Выбор контракта
     * @param id
     */
    function onSelectContract(id: number){
        history.push(`/contract/${id}`);
    }

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        saveItem(dispatch).then( ()=>{
                console.log('state', hasError);
                history.push('/clients/');
            }
        )
    };

    /**
     * Удалить запись со сменой
     * @param id
     */
    const handleDeleteContractItem = (id: number)=> {
        confirm(
            {
                'title': 'Подтверждение',
                description: `Удалить выбранную запись?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
            }
        ).then(() =>
            dispatch(deleteTeamItem(id))
        );
    };

    useEffect( ()=> {
        dispatch(loadClientItem(clientId));
    }, [dispatch]);

    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }


    return (
        <div className={classes.root}>
        <Card
            {...rest}
            className={className}
        >
            <form
                autoComplete="off"
                onSubmit={saveHandler}
            >
                <CardHeader subheader="" title="Клиент"/>
                <Divider />
                <CardContent>
                    <Paper className={classes.paper_bar}>
                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            scrollButtons="on"
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="scrollable force tabs example"
                            centered
                        >
                            <Tab label="Основное" {...a11yProps(PAGE_MAIN)} />
                            <Tab label="Контракты"  {...a11yProps(PAGE_CONTRACT)} />
                        </Tabs>
                    </Paper>
                    <TabPanel value={tab} index={PAGE_MAIN}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Наименование клиента"
                                margin="dense"
                                name="clientName"
                                onChange={handleChange}
                                required
                                value={clientItem.clientName}
                                variant="outlined"
                                id="IdClientName"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Адрес регистрации"
                                margin="dense"
                                name="clientAddr"
                                onChange={handleChange}
                                required
                                value={clientItem.clientAddr}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={8}
                            xs={8}
                        >
                            <TextField
                                fullWidth
                                label="Контактный сотрудник"
                                margin="dense"
                                name="clientEmployee"
                                onChange={handleChange}
                                value={clientItem.clientEmployee}
                                variant="outlined"
                                required={true}
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={4}
                        >
                            <TextField
                                fullWidth
                                label="Контактный телефон"
                                margin="dense"
                                name="contactPhone"
                                onChange={handleChange}
                                value={clientItem.contactPhone}
                                variant="outlined"
                                required={true}
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Факс"
                                margin="dense"
                                name="contactFax"
                                onChange={handleChange}
                                value={clientItem.contactFax}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Email"
                                margin="dense"
                                name="contactEmail"
                                onChange={handleChange}
                                value={clientItem.contactEmail}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="БИН"
                                margin="dense"
                                name="reqBin"
                                onChange={handleChange}
                                required
                                value={clientItem.reqBin}
                                variant="outlined"
                                inputProps={{'maxLength': 12}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="Лиц. счёт"
                                margin="dense"
                                name="reqAccount"
                                onChange={handleChange}
                                required
                                value={clientItem.reqAccount}
                                variant="outlined"
                                inputProps={{'maxLength': 20}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="БИК"
                                margin="dense"
                                name="reqBik"
                                onChange={handleChange}
                                required
                                value={clientItem.reqBik}
                                variant="outlined"
                                inputProps={{'maxLength': 8}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Банк"
                                margin="dense"
                                name="reqBank"
                                onChange={handleChange}
                                required
                                value={clientItem.reqBank}
                                variant="outlined"
                                inputProps={{'maxLength': 255}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Дополнительно"
                            multiline
                            margin="dense"
                            rows="5"
                            name="comment"
                            value={clientItem.comment}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                disabled
                                name="created"
                                margin="dense"
                                id="filled-disabled"
                                label="Создан"
                                value={moment(clientItem.created).format('YYYY.MM.DD')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={10}
                        >
                            <TextField
                                fullWidth
                                disabled
                                name="clientAgent"
                                margin="dense"
                                id="filled-disabled"
                                label="Агент"
                                value={clientItem.clientAgent}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    </TabPanel>
                    <TabPanel value={tab} index={PAGE_CONTRACT}>
                        <Grid container spacing={1}>
                            <Grid item xs={11}>
                                <Typography variant={"h5"}>
                                    Список контрактов
                                </Typography>
                            </Grid>
                            {
                                <Grid item xs={1}>
                                    <Tooltip title={'Добавить контракт'}>
                                        <Fab color="default" aria-label="add">
                                            <AddIcon/>
                                        </Fab>
                                    </Tooltip>
                                </Grid>
                            }
                            {
                                contracts.map((contract: any) =>(
                                    <ClientContractItem
                                        item={contract}
                                        onClickItem={onSelectContract}/>
                                ))
                            }
                        </Grid>
                    </TabPanel>

                </CardContent>
                <Divider />
                <CardActions>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        Сохранить
                    </Button>
                    <Button
                        color="default"
                        variant="contained"
                        onClick={(event => history.push('/clients'))}
                    >
                        Отменить
                    </Button>
                </CardActions>
            </form>
        </Card>
        </div>
    );
};

export default ClientItem;
