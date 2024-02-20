export type OrderRequest = {
    id: string,
    quantity: number
}
export interface Order {
    _id: string,
    paid: boolean,
    totalPrice: number,
    createdAt: string,
    userId: string
}