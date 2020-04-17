# useFetch

This implementation of a useFetch hook adds the ability to conditionally call REST endpoints which is missing from other useFetch functions I've seen.

## Features

- Noop State
- Loading state
- Error state including handling of HTTP error status
- Accepts header token
- Conditional fetch
- Refetch

## Useage
```sh
  yarn add yet-another-usefetch
```

```js
import { useFetch } from "yet-another-usefetch";
```

## ARGS

`url` string _default: null_

If the url exists as an argument of the hook, the request will be made immediately

`method` string _default: GET_

Set the method of HTTP request you are making

`body` object _default: null_

The data payload of the network request. _Note: The body does not need to be stringified beforehand as it is stringified inside the hook function._

`headers` object _default: null_

Any HTTP headers that you'd like to add to the request. _Note: There are default headers already included in the hook listed below. Additionally, if you want to use an auth token, read below_
```json
{
  Accept: 'application/json',
  'Content-Type': 'application/json'
}
```

`addHeaders` boolean _default: true_

If you'd like to send a request without headers, you can pass this argument

`token` string _default: null_

Useful if you'd like to add your own authorization token. It uses the following format where `token` is the value of your argument
```json
{
  Authorization: `Bearer ${token}`
}
```

## API

`noop` bool

Return true if the fetch url has not been called

`loading` bool

Returns true if the fetch url has been set but there has not been a response

`response` object

Returns when the request resolves successfully

`error` object

Returns if there was a problem executing the request

`setFetchUrl` function

Initiates the fetch request if a url wasn't supplied beforehand. Once the url is set the request initiates. Accepts a _string_ url.

`setFetchBody` function

When updating server data this function sets the body. Useful if you are sending user inputted data. Used in conjuction with setFetchUrl()

`rerunFetch` function

Initiates another request to the server. Accepts a _boolean_ argument, typically `true`, which gets reset to false after the request resolves or errors.

## Examples

[Code Sandbox Example](https://codesandbox.io/s/yet-another-usefetch-example-ogkjb?file=/src/UseFetchExample.js)

Simple GET

```
  const {loading, response, error} = useFetch('https://example.com/users')
```

Conditional GET

```
  const {loading, response, error, setFetchUrl, rerunFetch} = useFetch()
  const getData = () => setFetchUrl('https://example.com/users')
  const getNewData = () => rerunFetch(true)
```

Conditional POST

```
  const {noop, loading, response, error, setFetchUrl, setFetchBody} = useFetch(null, 'POST')
  const handleSubmit = (formData) => {
    setFetchBody(formData);
    setFetchUrl('https://example.com/users')
  }
```

### Requires a peer dependency of `react: >=16.8.0`
