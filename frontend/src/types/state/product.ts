import {Product} from 'types/model/product'

export interface IProductState {
    products: Product[],
    productItem: Product,
    isLoading: boolean,
    error: string,
    hasError: boolean
}