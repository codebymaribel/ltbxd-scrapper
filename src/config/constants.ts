/**
 * Website main URL
 * @constant
 */
export const MAIN_URL = 'https://letterboxd.com'


/**
 * Type of lists Object
 * @constant
 */

export const LIST_TYPES = {
    watchlist: 'watchlist',
    films: 'films',
    lists: 'lists'
} as const;

export const QUERY_RESULT_STATUS = {
    ok: 'OK',
    failed: 'FAILED',
    pending: 'PENDING',
    not_found: '404',
    error: 'ERROR'
} as const;