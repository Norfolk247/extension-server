const request = require('request')
require('dotenv').config()

/*const whoisRequest = (domainName) => {
    const whoisAPIKey = process.env.WHOIS_API_KEY
    return new Promise((resolve, reject) => {
        request({
            url: `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisAPIKey}&domainName=${domainName}&outputFormat=JSON`,
            timeout: 3000
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                const { WhoisRecord, ErrorMessage } = JSON.parse(body)
                if (ErrorMessage) {
                    const { msg } = ErrorMessage
                    reject({ statusCode: 404, message: msg })
                    return
                }
                const { createdDate, updatedDate } = WhoisRecord
                resolve([createdDate, updatedDate])
            } else {
                if (err.code === 'ESOCKETTIMEDOUT') {
                    reject({ statusCode: 504, message: err })
                    return
                }
                reject({ statusCode: 500, message: err })
            }
        })
    })
}*/
const requestBase = (url, callback) => {
    return new Promise((resolve, reject) => {
        request({
            url,
            timeout: 3000,
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                callback(resolve, reject, body)
            } else {
                if (err.code === 'ESOCKETTIMEDOUT') {
                    reject({ statusCode: 504, message: err })
                    return
                }
                reject({ statusCode: 500, message: err })
            }
        })
    })
}

const whoisAPIKey = process.env.WHOIS_API_KEY
const whoisRequest = (domainName) => requestBase(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisAPIKey}&domainName=${domainName}&outputFormat=JSON`,
    (resolve, reject, body) => {
        const { WhoisRecord, ErrorMessage } = JSON.parse(body)
        if (ErrorMessage) {
            const { msg } = ErrorMessage
            reject({ statusCode: 404, message: msg })
            return
        }
        const { createdDate, updatedDate } = WhoisRecord
        resolve({createdDate, updatedDate})
    }
)
const phishStatsRequest = (domainName) => requestBase(
    `https://phishstats.info:2096/api/phishing?_where=(host,eq,${domainName}`,
    (resolve, reject, body) => {
        const records = JSON.parse(body)
        if (records.length == 20) {
            reject({statusCode: 500, message: 'Server error'})
        }
        if (records.length > 0) {
            resolve(records[0])
            return
        }
        reject({ statusCode: 404, message: 'No records in database'})
    }
)

module.exports = { whoisRequest, phishStatsRequest }