"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./config/constants");
const fetch_1 = require("./fetch");
/**
 * @description Returns an array of objects with the user's watchlist data
 * @param {Object} params
 * @returns Promise<AxiosResponse<UserModel>>
 */
const getWatchlist = (username) => {
    const testurl = (0, fetch_1.getData)(username, constants_1.WATCHLIST_URL);
    console.log(testurl);
};
getWatchlist('maribelbhf');
