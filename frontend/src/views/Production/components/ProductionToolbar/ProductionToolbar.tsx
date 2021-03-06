import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { SearchInput } from 'components';
import { useHistory } from "react-router-dom";
import { KeyboardDatePicker} from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Product} from "types/model/product";
import {PROD_PERIOD_END, PROD_PERIOD_START} from "types/Settings";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import DomainOutlinedIcon from '@material-ui/icons/DomainOutlined';
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";


const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        margin: theme.spacing(1),
    },
    spacer: {
        flexGrow: 1
    },
    importButton: {
        marginRight: theme.spacing(1)
    },
    exportButton: {
        marginRight: theme.spacing(1)
    },
    searchInput: {
        marginRight: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
    },
    formControlWidth: {
        minWidth: 250
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    white: {
        color: theme.palette.grey["100"],
        backgroundColor: theme.palette.background.default
    }
}));

interface IDefaultToolbar {
    className: string;
    newItemUrl: string;
    onFind: any;
    onDelete: any;
    products: Product[];
    onRefresh: (startDate: Date | null, endDate: Date | null, product?: number, state?: number) => void;
}

const ProductionToolbar = (props: IDefaultToolbar) => {
    const classes = useStyles();
    const history = useHistory();
    const { className, newItemUrl, onFind, onDelete, products, onRefresh, ...rest } = props;
    const [firstDate, setFirstDate] = React.useState<Date | null>(new Date());
    const [endDate, setEndDate] = React.useState<Date | null>(new Date());
    const [product, setProduct] = React.useState<number>(0);

    const handleFirstDateChange = (date: Date | null) => {
        setFirstDate(date);
    };
    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date)
    };
    const handleChangeProduct = (event: React.ChangeEvent<{ value: unknown }>)=>{
        setProduct(event.target.value as number);
    };

    /**
     * Запрос данных с сервера
     */
    const handleRefreshData = ()=> {
        onRefresh(firstDate, endDate, product);
    };

    /**
     * Сохраненные данные начала и окончания периода
     */
    useEffect(()=>{
        const d1: string|null = localStorage.getItem(PROD_PERIOD_START);
        const d2: string|null = localStorage.getItem(PROD_PERIOD_END);
        if (d1) {setFirstDate(new Date(d1))}
        if (d2) {setEndDate(new Date(d2))}
    }, []);

    /**
     * Поиск по Enter
     * @param event
     */
    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    /**
     * Новая производственная карта
     */
    function onNewItemButtonHandler() {
        history.push(newItemUrl);
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> <DomainOutlinedIcon color={"primary"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Производство</Typography>
                </ListItem>
            </List>
            <div className={classes.buttonGroup}>
                <span className={classes.spacer} />
                <Button color="primary" variant="contained" onClick={onNewItemButtonHandler}>Новая карта</Button>
                <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
            </div>

                <div className={classes.row}>
                    <SearchInput
                        className={classes.searchInput}
                        onEnterKeyDown={onKeyDownHandler}
                        placeholder='Поиск по продукции'
                    />

                    <FormControl className={clsx(classes.formControl, classes.formControlWidth)}>
                        <InputLabel id="demo-simple-select-helper-label">Продукция</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={product}
                            onChange={handleChangeProduct}
                        >
                            <MenuItem value={0}>
                                <em>не указано</em>
                            </MenuItem>
                            {
                                products.map(item=>(
                                    <MenuItem value={item.id}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <KeyboardDatePicker
                        className={classes.formControl}
                        id="start_date-picker-dialog"
                        label="Начало периода"
                        format="dd/MM/yyyy"
                        value={firstDate}
                        onChange={handleFirstDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        className={classes.formControl}
                        id="end_date-picker-dialog"
                        label="Окончание периода"
                        format="dd/MM/yyyy"
                        value={endDate}
                        onChange={handleEndDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <Button variant="contained" onClick={handleRefreshData}>
                        Обновить
                    </Button>
                </div>
        </div>
    );
};

export default ProductionToolbar;
