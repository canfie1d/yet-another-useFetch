import { useEffect, useReducer } from 'react';

function fetchReducer(state, action) {
  switch (action.type) {
    case 'SET_URL':
      return { ...state, ...{ fetchUrl: `${action.payload}` }, loading: true };
    case 'SET_BODY':
      return { ...state, fetchBody: action.payload };
    case 'SET_RESPONSE':
      return {
        ...state,
        ...{ response: action.payload },
        ...{ rerun: false },
        loading: false,
      };
    case 'SET_ERROR':
      return { ...state, ...{ error: action.payload }, ...{ rerun: false }, loading: false };
    case 'SET_RERUN':
      return {...state, ...{ rerun: action.payload }};
    default:
      throw new Error();
  }
}
export const useFetch = (
  url= null,
  method= 'GET',
  body= null,
  headers= null,
  addHeaders= true,
  token= null
) => {
  const initialState = {
    loading: !!url,
    fetchUrl: url,
    fetchBody: body,
    response: null,
    error: null,
    rerun: false,
  };
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const setFetchUrl = (url) => {
    dispatch({ type: 'SET_URL', payload: url });
  };
  const setFetchBody = (body) => {
    dispatch({ type: 'SET_BODY', payload: body });
  };
  const rerunFetch = (payload) => {
    dispatch({type: 'SET_RERUN', payload: payload })
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!state.fetchUrl) return;
    let cancel = false;
    (async () => {
      try {
        let options = {
          method: method,
          credentials: 'same-origin',
        };
        if (state.fetchBody) {
          options.body= JSON.stringify(state.fetchBody);
        }

        if (addHeaders) {
          //default headers
          options.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };
          if (token) {
            Object.assign(options.headers, {Authorization: `Bearer ${token}`})
          }
          // if call supplied optional headers
          if (headers) {
            options.headers = Object.assign(options.headers, headers);
          }
        }
        const res = await fetch(state.fetchUrl, options);
        if (res.ok === false) {
          dispatch({
            type: 'SET_ERROR',
            payload: { status: res.status, message: res.statusText },
          });
        } else {
          if (cancel) return;
          const json = await res.json();
          dispatch({ type: 'SET_RESPONSE', payload: json });
        }
      } catch (error) {
        if (cancel) return;
        if (error.name === 'AbortError') {
          dispatch({
            type: 'SET_ERROR',
            payload: 'Request was canceled via controller.abort',
          });
        } else {
          dispatch({ type: 'SET_ERROR', payload: error });
        }
      }
    })();
    return () => {
      controller.abort();
      cancel = true;
    };
  }, [state.fetchUrl, state.rerun]); // eslint-disable-line
  return {
    noop: !state.fetchUrl && !state.response,
    loading: state.loading,
    response: state.response,
    error: state.error,
    setFetchUrl,
    setFetchBody,
    rerunFetch,
  };
};
