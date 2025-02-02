# ltbxdscrapper

A scrapper for Letterboxd public data.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
- [Query Parameters](#query-parameters)
- [Response Objects](#response-objects)
- [Types](#types)
- [Collaboration](#collaboration)
- [License](#license)

---

## Features

- Get user watchlist films.
- Get films from a public list by URL.
- Get user public lists.
- Search films on Letterboxd by title.

---

## Installation

```bash
npm install ltbxdscrapper
```

## Usage

### Setup

```javascript
// Require letterboxd scrapper library
import ltbxdscrapper from 'ltbxdscrapper';
```

### Use example

```javascript
import ltbxdscrapper from "ltbxdscrapper";

const userwatchlist = await ltbxdscrapper.getWatchlist({
  username: "username",
  options: {
    posters: false,
  },
});

// userwatchlist returns:

{
    status: 'OK',
    data: [
        {
            id: '50602',
            title: 'Persepolis',
            slug: 'persepolis',
            poster: 'https://a.ltrbxd.com/resized/sm/upload/28/um/1t/jq/dYvyF1RlNokAd1N7Nek0vDpYsV6-0-125-0-187-crop.jpg?v=fc5d71c744'
        }
    ],
    errorMessage: null,
}
```

---

## Functions

Here's the list of available functions in this package:

### getWatchlist

- **Use**: get user watchlist films.
- **Requires**: {**username**: letterboxd username, **options**: <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#options-object">query options object</a>}
- **Returns**: <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#film-object">Film Object[]</a> in the data param of the <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#query-response">Query Response Object</a>

### getListFilms

- **Use**: returns an array of objects with the user's list data
- **Requires**: {**url**: letterboxd list URL, **options**: <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#options-object">query options object</a>}
- **Returns**: <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#film-object">Film Object[]</a> in the data param of the <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#query-response">Query Response Object</a>

### getUserLists

- **Use**: get user public lists names and IDs.
- **Requires**: {**username**: letterboxd username}
- **Returns**: <a href="#lists-search-object">User Lists Object[]</a> in the data param of the <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#query-response">Query Response Object</a>

### searchFilm

- **Use**: searches for films results based on a string.
- **Requires**: film title string
- **Returns**: <a href="#film-search-object"> Film Search Object[]</a> in the data param of the <a href="https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#query-response">Query Response Object</a>

---

## Query Objects

#### Film Object

```javascript
    {
      id: '478428', // Letterboxd film ID.
      title: 'The Brutalist', // film title.
      slug: 'the-brutalist', // film slug (this is what they use for the films URL).
      poster: 'https://s.ltrbxd.com/static/img/empty-poster-125.f760b9b5.png' // film poster (rezised from letterboxd website).
    }
```

#### User Lists Object

```javascript
  {
    id: '58079975',
    title: ' The 97th Academy Award nominees for Best Costume Design',
    url: 'https://letterboxd.com/oscars/list/the-97th-academy-award-nominees-for-best-10/'
  }
```

#### Lists Search Object

```javascript
  {
    title: "The Brutalist",
    pageURL: "https://letterboxd.com/film/the-brutalist/",
    poster: "https://s.ltrbxd.com/static/img/empty-poster-125.f760b9b5.png"
  }
```

#### Options Object

```javascript
{
  poster: false; // If false returns film data without the letterboxd poster, if not specified returns always true.
}
```

### Query Response

#### Query Response Object

```javascript
{
  status: "FAILED", //
  data: [],
  errorMessage: string,
}
```

#### Query status

- **404** -> The URL does not exist on letterboxd.
- **OK** -> The request was completed successfully.
- **FAILED** -> There was an issue completing the request.
- **PENDING** -> The request is not resolved yet.

#### Error Messages

- INCOMPLETE PARAMETERS
- YOU NEED TO SUBMIT A VALID LETTERBOXD URL
- THERE WAS A SYSTEM ERROR PROCESSING THE REQUEST
- PAGE NOT FOUND
- SCRAPPER METHOD FAILED

## Types

For more info about the types please refer to the [types folder](./src/types/index.d.ts)

## 🤝 Contributing

> todo

## 🎖 License

> todo

---

Made with ❤ by [CodebyMaribel](https://github.com/codebymaribel)

---
