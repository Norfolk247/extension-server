const { whoisRequest, phishStatsRequest } = require("./chainRequests")
const { SSL_TLS_Check } = require("./SSL_TLS_Checker")

module.exports = function (domainName) {
    return new Promise(function (resolve) {
        let results = {}
        let completed = 0
        const finallyHandler = () => {
            completed += 1
            if (completed === 3) resolve(results)
        }
        whoisRequest(domainName)
            .then(result => results = { ...results, domainInfo: { code: 200, data: result } })
            .catch(({ statusCode, message }) => results = { ...results, domainInfo: { code: statusCode, message } })
            .finally(finallyHandler)
        phishStatsRequest(domainName)
            .then(result => results = { ...results, malicioutDatabase: { code: 200, data: result } })
            .catch(({ statusCode, message }) => results = { ...results, malicioutDatabase: { code: statusCode, message } })
            .finally(finallyHandler)
        SSL_TLS_Check(`https://${domainName}`)
            .then(result => results = { ...results, certificateInfo: { code: 200, data: result } })
            .catch(({ statusCode, message }) => results = { ...results, certificateInfo: { code: statusCode, message } })
            .finally(finallyHandler)
        return
    })
}