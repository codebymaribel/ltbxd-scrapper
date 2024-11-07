# ltbxd-scrapper

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

## Key Features

- Get user watchlist films.
- Get user public lists.
- Get list films by list title or URL.
- Search film on Letterboxd by title.
- Search film on Letterboxd by URL.

## Installation

```bash
npm install ltbxd-scrapper
```

## Usage

### Setup

```javascript
// Require letterboxd scrapper library
import ltbxdscrapper from "ltbxd-scrapper";
```

### Use example

```javascript
import ltbxdscrapper from "ltbxd-scrapper";

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
    ]
}
```

## Functions

Here's the list of available functions in this package:

<table>
<tr>
<th>Name</th>
<th>Description</th>
<th>Returns</th>
</tr>
<tr>
<th></th>
<th>Film</th>
<th></th>
</tr>
<tr>
<td width="10%">
<strong>searchFilm</strong> 
</td>
<td width="50%">
<strong>Use: </strong>Searches for films results based on a string.</br>
<strong>Requires: </strong>string.
</td>
<td width="40%">
- <strong>status</strong>: a string with the status of the request. The available status can be found in the <a href="#query-status">query status</a> section.
<br/>
<br/>
- <strong>data:</strong><a href="#film-search-object"> FilmSearchObject[]</a> 
</td>
</tr>
<tr>
<th></th>
<th>Lists</th>
<th></th>
</tr>
<tr>
<td width="10%">
<strong>getWatchlist</strong> 
</td>
<td width="50%">
<strong>Use: </strong>Get user watchlist films </br>
<strong>Requires: </strong> <a href="#query-parameters">UserQuery</a> 
</td>
<td width="40%">
- <strong>status</strong>: a string with the status of the request. The available status can be found in the <a href="#query-status">query status</a> section.
<br/>
<br/>
- <strong>data</strong>: <a href="#film-object">FilmObject[]</a> 
</td>
</tr>
<tr>
<td width="10%">
<strong>getPublicLists</strong> 
</td>
<td width="60%">
<strong>Use: </strong>Get user public lists names and IDs</br>
<strong>Requires: </strong> <a href="#query-parameters">UserListsParams</a>
</td>
<td width="20%">
- <strong>status</strong>: a string with the status of the request. The available status can be found in the <a href="#query-status">query status</a> section.
<br/>
<br/>
- <strong>data</strong>: <a href="#lists-search-object">ListsSearchObject[]
</td>
</tr>
<tr>
<td width="10%">
<strong>getList</strong> 
</td>
<td width="60%">
<strong>Use: </strong>Get a list data using the URL </br>
<strong>Requires: </strong> ListQuery
</td>
<td width="20%">

</td>
</tr>
</table>

## Query Parameters

<table>
<tr>
<th>Query</th>
<th>Parameters</th>
</tr>
<tr id="watchlistParams">
<td>
<strong>WatchlistParams</strong>
</td>
<td>
{<br/>
  <strong>username</strong>: letterboxd username, <br/>
  <strong>options</strong>: <a href="#options-params">options object</a> (optional)<br/>
  }
</td>
</tr>
<tr id="userListParams">
<td>
<strong>UserListParams</strong>
</td>
<td>
{ <strong>username</strong>: letterboxd username }
</td>

</tr>
</table>

#### Options Object

- **poster**: if false returns film data without the letterboxd poster, if not specified returns always true.

## Response Objects

#### Film Object

- **id**: Letterboxd film ID.
- **title**: film title.
- **slug**: film slug (this is what they use for the films URL).
- **poster**: film poster (rezised from letterboxd website).

#### Film Search Object

- **title**: film title.
- **pageURL**: film page URL on Letterboxd.
- **poster**: film poster (rezised from letterboxd website).

#### Lists Search Object

- **id**: Letterboxd list ID.
- **title**: list title.
- **url**: list page URL on Letterboxd.

#### Query status

- **404** -> The URL does not exist on letterboxd.
- **OK** -> The request was completed successfully.
- **FAILED** -> There was an issue completing the request.
- **PENDING** -> The request is not resolved yet.

## Types

For more info about the types please refer to the [types folder](./types/)

## 🤝 Contributing

> todo

## 🎖 License

> todo

---

Made with ❤ by [Maribel Hernandez](https://github.com/codebymaribel)

---
