const queryString = require('query-string');

export const parseFileName = (url) => {
    var saerchQuery = url.split("?")
    const parsed = queryString.parse(saerchQuery[1]);
    var fileName = parsed.filename
    return fileName
}

export const parseFileMessage = (url) => {
    var saerchQuery = url.split("?")
    const parsed = queryString.parse(saerchQuery[1]);
    var message = parsed.message
    return message
}