# ltbxd-scrapper

A scrapper for Letterboxd public data.

## Table of Contents

## Key Features

- Get user watchlist data
- Search movie data by title
- Search movie list data by title
- Search movie list data by url

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
    movies: [
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
<th>Movie</th>
<th></th>
</tr>
<tr>
<td width="10%">
<strong>getMovieData</strong> 
</td>
<td width="60%">
<strong>Use: </strong>Gets a movie data by title or URL</br>
<strong>Requires: </strong> 
</td>
<td width="20%">
<a href="#movie-query-result">Movie Query Result</a> 
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
<td width="60%">
<strong>Use: </strong>Get user watchlist data </br>
<strong>Requires: </strong> <a href="#getWatchlist">UserQuery</a> 
</td>
<td width="20%">
[MovieData Result Object](#movies-data-object)
</td>
</tr>
<tr>
<td width="10%">
<strong>getPublicLists</strong> 
</td>
<td width="60%">
<strong>Use: </strong>Get user public lists names and IDs</br>
<strong>Requires: </strong> ListQuery
</td>
<td width="20%">
[MovieData Result Object] (#moviedata-result-object)
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
<a href="#object-props">MovieData Result Object</a> 
</td>
</tr>
</table>

## Query Parameters

<table>
<tr>
<th>Query</th>
<th>Parameters</th>
</tr>
<tr id="getWatchlist">
<td>
<strong>UserQuery</strong>
</td>
<td>
- <strong>username</strong>: letterboxd username <br/>
- <strong>options</strong>: <a href="#options-params">options object</a> (optional)
</pre>
</td>
</tr>
</table>

##### Options Object

- **poster**: if false returns movie data without the letterboxd poster, if not specified returns always true.

## Result Objects

For more info about the types please refer to the [types folder](./types/)

<table>
<tr>
<th>Name</th>
<th>Parameters</th>
</tr>
<tr id="getWatchlist">
<td>
<strong>MovieQuery</strong>
</td>
<td>
- <strong>status</strong>: a string with the status of the request. The available status can be found in the <a href="#query-status">query status</a> section.
<br/>
- <strong>data</strong>: an array of <a href="#movie-object">movie objects</a> section.
</td>
</tr>
<tr id="getListByTitle">
<td>
<strong>ListTitleQuery</strong>
</td>
<td>
- <strong>title</strong>: a string with the name of the movie
<br/>
</td>
</tr>
</table>

##### Movie Object

- **id**: Letterboxd movie ID
- **title**: movie title
- **slug**: movie slug (this is what they use for the movies URL)
- **poster**: movie poster (rezised from letterboxd website)

##### Query status

- **404** -> The URL does not exist on letterboxed
- **OK** -> The request was completed successfully
- **FAILED** -> There was an issue completing the request
- **PENDING** -> The request is not resolved yet

## 🤝 Contributing

> todo

## 🎖 License

>todo

----

Made with ❤ by [Maribel Hernandez](https://github.com/codebymaribel)

----