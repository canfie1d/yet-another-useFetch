import { useState, useEffect } from "react";

export const useFetch = (
  url,
  method = "GET",
  body = null,
  headers = null,
  addHeaders = true,
  token = null
) => {
  const [fetchUrl, setFetchUrl] = useState(url);
  const [fetchBody, setFetchBody] = useState(body);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fetchUrl) return;

    (async () => {
      try {
        let options = {
          method: method,
          credentials: "same-origin",
        };

        if (fetchBody) {
          options.body = fetchBody;
        }

        if (addHeaders) {
          if (token) {
            options.headers = {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            };
          } else {
            options.headers = {
              Accept: "application/json",
              "Content-Type": "application/json",
            };
          }
        }

        // if call supplied optional headers
        if (headers) {
          options.headers = Object.assign(options.headers, headers);
        }

        const res = await fetch(fetchUrl, options);
        if (res.ok === false) {
          setError({ status: res.status, message: res.statusText });
        } else {
          const json = await res.json();

          setResponse(json);
        }
      } catch (error) {
        setError(error);
      }
    })();

    setFetchUrl(url);
  }, [fetchUrl]);
  return {
    noop: !fetchUrl && !response,
    loading: fetchUrl && !response,
    response,
    error,
    setFetchUrl,
    setFetchBody,
  };
};
