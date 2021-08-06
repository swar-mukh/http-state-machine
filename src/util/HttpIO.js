const querystring = require('querystring')

const processStream = (request) => {
    const promise = new Promise((resolve, reject) => {
        let body = []

        request.on("error", err => reject(err))
        request.on("data", chunk => body.push(chunk))
        request.on("end", () => resolve(Buffer.concat(body).toString()))
    })

    return promise
}

const stringToArray = (value, delimiter) =>
    (value && value.trim() !== "") ?
        value.split(delimiter).map(item => item.trim())
        : []

const keyValueRegex = /name=\"(.+)\"\r\n\r\n(.+)\r\n--/m
const keyFileRegex = /name=\"(.+)\"; filename=\"(.+)\"\r\nContent-Type: (.+)\r\n\r\n([\S\s]*)\r\n--/m

const simplifyRequest = async (request) => {
    const { headers, method, url } = request

    const simplifiedRequest = {
        server: request.socket.address(),
        client: {
            address: request.socket.remoteAddress,
            family: request.socket.remoteFamily,
            port: request.socket.remotePort,
        },
        protocol: {
            secure: request.socket.encrypted ? true : false,
            version: {
                full: request.httpVersion,
                major: request.httpVersionMajor,
                minor: request.httpVersionMinor
            }
        },
        method,
        url: new URL(url, `${request.socket.encrypted ? "https" : "http"}://${headers["host"]}`),
        headers: {
            ...headers,
            cookie: new Map(stringToArray(headers.cookie, ";").map(item => item.split("="))),
            accept: stringToArray(headers.accept, ","),
            "accept-encoding": stringToArray(headers["accept-encoding"], ","),
            "accept-language": stringToArray(headers["accept-language"], ",")
        }
    }

    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
        let parsedData

        const rawData = await processStream(request)
        const contentType = headers["content-type"]

        if (contentType === "application/x-www-form-urlencoded") {
            parsedData = querystring.decode(rawData)
        } else if (contentType === "application/json") {
            parsedData = JSON.parse(rawData)
        } else if (contentType?.startsWith("multipart/form-data")) {
            parsedData = {}
            const files = {}

            const boundary = contentType.substring(contentType.indexOf("=") + 1).trim()

            rawData
                .split(boundary)
                .filter(part => part.startsWith("\r\nContent-Disposition"))
                .map(part => part.trim())
                .forEach(part => {
                    if (keyValueRegex.test(part)) {
                        const extractedData = keyValueRegex.exec(part)
                        parsedData[extractedData[1]] = extractedData[2]
                    }
                    else if (keyFileRegex.test(part)) {
                        const extractedData = keyFileRegex.exec(part)

                        const fileKey = extractedData[1]
                        const actualFile = Buffer.from(extractedData[4]) // TODO: parse depending on content-type
                        
                        const fileObject = {
                            filename: extractedData[2],
                            contentType: extractedData[3],
                            file: actualFile,
                            size: actualFile.length
                        }

                        if (files[fileKey]) {
                            files[fileKey].push(fileObject)
                        } else {
                            files[fileKey] = [fileObject]
                        }
                    }
                })

            Object.entries(files).forEach(fileGroup => {
                parsedData[fileGroup[0]] = fileGroup[1].length === 1 ? fileGroup[1][0] : fileGroup[1]
            })
        } else if (contentType === "application/xml") { // Think about this someday!
            parsedData = rawData
        } else {
            parsedData = rawData
        }

        if (parsedData) {
            simplifiedRequest.body = parsedData
        }
    }

    return simplifiedRequest
}

module.exports = { simplifyRequest }