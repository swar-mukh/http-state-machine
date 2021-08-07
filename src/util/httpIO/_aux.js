module.exports = {
    Constants: {
        KEY_VALUE_REGEX: /name=\"(.+)\"\r\n\r\n(.+)\r\n--/m,
        KEY_FILE_REGEX: /name=\"(.+)\"; filename=\"(.+)\"\r\nContent-Type: (.+)\r\n\r\n([\S\s]*)\r\n--/m,
    },
    processStream: (request) => {
        const promise = new Promise((resolve, reject) => {
            let body = []

            request.on("error", err => reject(err))
            request.on("data", chunk => body.push(chunk))
            request.on("end", () => resolve(Buffer.concat(body).toString()))
        })

        return promise
    },
    stringToArray: (value, delimiter) =>
        (value && value.trim() !== "") ?
            value.split(delimiter).map(item => item.trim())
            : [],
    urlToObject: urlObject => {
        return {
            href: urlObject.href,
            origin: urlObject.origin,
            protocol: urlObject.protocol,
            username: urlObject.username,
            password: urlObject.password,
            host: urlObject.host,
            hostname: urlObject.hostname,
            port: urlObject.port,
            pathname: urlObject.pathname,
            search: urlObject.search,
            searchParams: Object.fromEntries(urlObject.searchParams.entries()),
            hash: urlObject.hash
        }
    }
}