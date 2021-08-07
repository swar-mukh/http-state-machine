const querystring = require('querystring')

const {
    Constants,
    processStream,
    stringToArray,
    urlToObject
} = require("./_aux")

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
        url: urlToObject(new URL(url, `${request.socket.encrypted ? "https" : "http"}://${headers["host"]}`)),
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
                    if (Constants.KEY_VALUE_REGEX.test(part)) {
                        const extractedData = Constants.KEY_VALUE_REGEX.exec(part)
                        parsedData[extractedData[1]] = extractedData[2]
                    }
                    else if (Constants.KEY_FILE_REGEX.test(part)) {
                        const extractedData = Constants.KEY_FILE_REGEX.exec(part)

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