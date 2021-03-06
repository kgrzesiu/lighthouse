import axios from 'axios'
import RawEndpoint from "services/endpoints/RawEndpoint"
import {Raw} from 'types/model/raw'
import {
    RAW_CLEAR_ERROR,
    RAW_DELETE_OK,
    RAW_LOAD_ERROR,
    RAW_LOAD_FINISH,
    RAW_LOAD_START,
    RAW_LOAD_SUCCESS,
    RAW_LOAD_SUCCESS_ITEM,
    RAW_UPDATE_OBJECT
} from "./types";

//FIXME При добавлении и удалении не обновляется результирующий стор
//FIXME Вынести управление ошибками и сообщениями в стор ошибок
/**
 * Загрузить список продукции
 * @param search поисковая строка
 * @param limit лимит вывода
 * @param offset сдвиг
 */
export function loadRaws(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: Raw[] = [];
        dispatch(fetchStart());
        try{
            const url = RawEndpoint.getRawList(search, limit, offset);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push({
                    id: response.data[key]['id'],
                    name: response.data[key]['name'],
                })
            });
            dispatch(fetchSuccess(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки списка!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить сырьё
 * @param id Код продукта
 */
export function deleteRaw(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(RawEndpoint.deleteRaw(id));
            if (response.status === 204) {
                const items = [...getState().raw.raws];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
            }
            else {
                dispatch(fetchError('Не удалось удалить сырьё!'))
            }
        }catch (e) {
            dispatch(fetchError('Не удалось удалить сырьё!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить сырьё по коду
 * @param id Код сырья
 */
export function loadRawItem(id: number){
    return async (dispatch: any, getState: any) => {
        let raw: Raw = {id: 0, name: ""};
        dispatch(fetchStart());
        try{
            const response = await axios.get(RawEndpoint.getRawItem(id));
            raw.id = response.data['id'];
            raw.name = response.data['name'];
            dispatch(rawLoadItemSuccess(raw))
        }catch (e) {
            dispatch(fetchError(e))
        }
        dispatch(fetchFinish())
    }
}

export function addNewRaw(raw: Raw) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            await axios.post(RawEndpoint.newRaw(), raw);
            dispatch(rawLoadItemSuccess(raw))
        }catch (e) {
            dispatch(fetchError('Не удалось добавить новое сырьё!'))
        }
    }
}

export function changeRaw(raw: Raw) {
    return {
        type: RAW_UPDATE_OBJECT,
        item: raw
    }
}

/**
 * Сохранить изменения
 * @param raw Объект сырья
 */
export function updateRaw(raw: Raw) {
    return async (dispatch: any, getState: any) => {
        try{
            await axios.put(RawEndpoint.saveRaw(raw.id), raw);
        }catch (e) {
            dispatch(fetchError(e))
        }
    }
}


export function clearError() {
    return{
        type: RAW_CLEAR_ERROR
    }
}
function fetchStart() {
    return {
        type: RAW_LOAD_START
    }
}

function deleteOk(items: Raw[]) {
    return{
        type: RAW_DELETE_OK,
        items
    }
}

function fetchFinish() {
    return {
        type: RAW_LOAD_FINISH
    }
}

function fetchError(error: string) {
    return{
        type: RAW_LOAD_ERROR,
        error: error
    }
}

function fetchSuccess(items: Raw[]) {
    return{
        type: RAW_LOAD_SUCCESS,
        items
    }
}

function rawLoadItemSuccess(rawItem: Raw) {
    return{
        type: RAW_LOAD_SUCCESS_ITEM,
        item: rawItem
    }
}
