"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getUserMovies: () => getUserMovies
});
module.exports = __toCommonJS(src_exports);

// src/functions.ts
var import_puppeteer = __toESM(require("puppeteer"));

// src/config/constants.ts
var MAIN_URL = "https://letterboxd.com";
var LIST_TYPES = {
  watchlist: "watchlist",
  films: "films"
};

// src/datafiltering.ts
var moviesMetadataArray = (page) => __async(void 0, null, function* () {
  return yield page.$$eval("div.film-poster", (filmsContainers) => {
    const htmlContent = [];
    filmsContainers.forEach((movieContainer) => {
      const movieID = movieContainer.getAttribute("data-film-id");
      const movieName = movieContainer.getAttribute("data-film-name");
      const movieSlug = movieContainer.getAttribute("data-film-slug");
      if (!movieID || !movieName || !movieSlug) return;
      htmlContent.push({
        id: movieID,
        name: movieName,
        slug: movieSlug
      });
    });
    return htmlContent;
  });
});
var postersArray = (page) => __async(void 0, null, function* () {
  return yield page.$$eval("div.film-poster > div > img", (posters) => {
    const postersarray = [];
    posters.forEach((poster) => {
      postersarray.push({ url: poster.src, alt: poster.alt });
    });
    return postersarray;
  });
});
var moviesDataArray = ({
  postersArray: postersArray2,
  moviesMetadataArray: moviesMetadataArray2
}) => moviesMetadataArray2.map((movieMetaObj) => {
  const { slug, name } = movieMetaObj;
  const moviePoster = postersArray2.find(
    ({ url, alt }) => url.includes(slug) || (alt == null ? void 0 : alt.includes(name))
  );
  const watchlistMovieObj = __spreadProps(__spreadValues({}, movieMetaObj), { moviePoster });
  return watchlistMovieObj;
});

// src/functions.ts
var getUserMovies = (user) => __async(void 0, null, function* () {
  const { username, category } = user;
  const moviesArray = [];
  try {
    const browser = yield import_puppeteer.default.launch();
    const page = yield browser.newPage();
    yield page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[category]}`);
    let lastPageReached = false;
    while (!lastPageReached) {
      const nextPageLink = yield page.$(".next");
      yield page.waitForSelector(".film-poster > div > a");
      const metadata = yield moviesMetadataArray(page);
      const posters = yield postersArray(page);
      const moviesCurrentPageArray = yield moviesDataArray({
        postersArray: posters,
        moviesMetadataArray: metadata
      });
      moviesArray.push(...moviesCurrentPageArray);
      const lastOne = yield page.evaluate(() => {
        return !!document.querySelector(
          ".paginate-nextprev.paginate-disabled > span.next"
        );
      });
      if (lastOne) {
        lastPageReached = true;
        break;
      }
      yield nextPageLink == null ? void 0 : nextPageLink.click();
      yield page.waitForNavigation();
      const URL = page.url();
    }
    yield browser.close();
    return moviesArray;
  } catch (error) {
    console.error(error);
    throw 500;
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserMovies
});
