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

export const ERROR_MESSAGES = {
    missing_parameters: 'INCOMPLETE PARAMETERS',
    not_valid_url: 'YOU NEED TO SUBMIT A VALID LETTERBOXD URL',
    try_catch_failed: 'THERE WAS A SYSTEM ERROR PROCESSING THE REQUEST',
    page_not_found: 'PAGE NOT FOUND',
    scrapper_method_failed: 'SCRAPPER METHOD FAILED'
} as const;