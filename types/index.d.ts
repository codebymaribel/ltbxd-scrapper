export * from './list'
export * from './user'
export * from './film'

export type PromiseAllSettledProps<T> = {
    status: "fulfilled" | "rejected"
    value: T
}