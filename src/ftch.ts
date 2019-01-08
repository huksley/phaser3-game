function throwStatus(response: Response) {
  if (!response.ok) {
    throw new Error("Failed (" + response.url + ") with status " + response.status + " " + response.statusText);
  } else {
    return response;
  }
}

/**
 * Just like a fetch but setup sensible defaults + setState({ loading }) before and after fetch
 * @param {string} url - URL to call
 * @param {Object} opts - Fetch options (default applied)
 * @param {this} that - Component to update state
 */
function ftch(url: string, opts?: any, that?: any) {
  opts = opts ? opts : {}
  opts.method = opts.method || "GET"
  opts.mode = opts.mode || "same-origin"
  opts.credentials = opts.credentials || "same-origin"
  if (typeof opts.headers === "undefined") {
    opts.headers = {}
  }
  if (opts.method !== "GET") {
    opts.headers["Content-Type"] = opts.headers["Content-Type"] || "application/json"
    if (typeof opts.body === "object" && opts.headers["Content-Type"] === "application/json") {
      opts.body = JSON.stringify(opts.body)
    }
  }
  opts.headers.Accept = opts.headers.Accept || "application/json"
  opts.loading = opts.loading || "loading"
  const loadingStarted = {}; loadingStarted[opts.loading] = true;
  const loadingFinished = {}; loadingFinished[opts.loading] = false;
  const stateResultError = opts.stateResultError || (opts.stateResult && that ? that.state[opts.stateResult] : null)
  console.log(`Fetch ${opts.method} ${url}`)
  if (that) that.setState(loadingStarted)
  return fetch(url, opts)
    .then(response => { if (opts.stateResponse) { const res = {}; res[opts.stateResponse] = response; that.setState(res); }; return throwStatus(response).json(); }) // parses response to JSON
    .catch(error => {
      console.error(`Fetch ${opts.method} ${url} error: `, error, arguments);
      if (that) that.setState(Object.assign({ error: error ? error.message : "unknown", exception: error }, loadingFinished));
      if (opts.stateResult && that) {
        const res = {}
        res[opts.stateResult] = stateResultError
        that.setState(res)
      } else {
        throw new Error(error ? error : "unknown")
      }
    }).then(json => {
      if (typeof json === "undefined" || json.error) {
        console.error(`Fetch ${opts.method} ${url} error: `, json ? json.error : "undefined");
        if (opts.stateResult && that) {
          const res = <any> {}
          res.error = json ? json.error : "undefined"
          res[opts.stateResult] = stateResultError
          that.setState(Object.assign(res, loadingFinished))
        } else {
          if (that) that.setState(Object.assign({ error: json ? json.error : "undefined" }, loadingFinished));
        }
      } else {
        console.log(`Fetch ${opts.method} ${url} complete: `, json);
        if (opts.stateResult && that) {
          const res = {}
          res[opts.stateResult] = json
          that.setState(Object.assign(res, loadingFinished))
        } else {
          if (that) that.setState(loadingFinished)
        }
      }
      return new Promise((resolve) => resolve(json))
    })
}

export { throwStatus, ftch };
