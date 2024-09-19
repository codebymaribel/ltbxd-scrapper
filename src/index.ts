export * from './queryFunctions'
export * from './types'
import { getUserList } from './queryFunctions'

getUserList({
    username: 'maribelbhf',
    category: 'watchlist',
    options:{ 
        posters: true
    }
})