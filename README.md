# useFetch

This implementation of a useFetch hook adds the ability to conditionally call REST endpoints which is missing from other useFetch functions I've seen.

## Features

- Noop State
- Loading state
- Error state
- Accepts header token
- Conditional fetch

## API

`noop` bool

return true if the fetch url has not been called

`loading` bool

returns true if the fetch url has been set but there has not been a response

`response` object

returns when the fetch call resolves successfully

`error` object

returns if there was a problem with the fetch call

`setFetchUrl` function

initiates the fetch call. Once the url is set the call initiates

`setFetchBody` function

when updating server data this function sets the body

## Examples

Simple GET

```
  const {loading, response, error} = useFetch('https://example.com/users')
```

Conditional GET

```
  const {loading, response, error, setFetchUrl} = useFetch()
  const getData = () => setFetchUrl('https://example.com/users')
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
