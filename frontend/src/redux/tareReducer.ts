import {ITareState} from "types/state/tare";
import {
    TARE_LOAD_START,
    TARE_LOAD_FINISH,
    TARE_DELETE_OK,
    TARE_LOAD_SUCCESS,
    TARE_ITEM_SUCCESS, TARE_UPDATE_OBJECT, TARE_CLEAR_ERROR
} from "./actions/types";
import {nullTare} from "../types/model/tare";

const initState = (): ITareState => ({
    tareItems: [],
    tareItem: nullTare,
    hasError: false,
    typeMessage: '',
    error: '',
    isLoading: false
});


export const tareReducer = (state: ITareState = initState(), action: any) => {

    switch (action.type) {
        case TARE_LOAD_START:
            return {...state, isLoading: true};
        case TARE_LOAD_FINISH:
            return {...state, isLoading: false};
        case TARE_LOAD_SUCCESS:
            return {...state, tareItems: action.items};
        case TARE_ITEM_SUCCESS:
            return {...state, tareItem: action.item};
        case TARE_UPDATE_OBJECT:
            return {...state, tareItem: action.item}
        case TARE_DELETE_OK:
            return {...state, tareItems: action.items};
        case TARE_CLEAR_ERROR:
            return {...state, error: '', hasError: false}
        default: return state;
    }
};
