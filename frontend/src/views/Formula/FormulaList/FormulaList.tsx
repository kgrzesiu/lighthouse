import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { FormulaTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import SnackBarAlert from 'components/SnackBarAlert';
import {deleteFormula, loadFormula} from "redux/actions/formulaAction";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const FormulaList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const formulas = useSelector((state: any) => state.formula.formulas);
    const isLoading = useSelector((state: any) => state.formula.isLoading);
    const errorValue = useSelector((state: any) => state.formula.error);
    const alertType = useSelector((state: any) => state.formula.typeMessage);
    const hasError = useSelector((state: any) => state.formula.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        //dispatch(clearError())
    };

    useEffect( ()=>{
            dispatch(loadFormula())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadFormula(findText))
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteFormula(item))
        });
    }

    function onClickTableItem(rawId: number){
        const newItemUrl = `/catalogs/formula/${rawId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Рецептура'}
                newItemTitle={'Новая рецептура'}
                newItemUrl={'/catalogs/formula/new'}
                findCaption={'Поиск рецептуры'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <FormulaTable
                        formulas={formulas}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
            <SnackBarAlert
                typeMessage={alertType}
                messageText={errorValue}
                isOpen={hasError}
                onSetOpenState={handleClose}
            />
        </div>
    );
};

export default FormulaList;
