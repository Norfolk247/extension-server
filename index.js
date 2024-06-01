require('dotenv').config()

const { errorHandler } = require('./middleware')
const requestChain = require('./apiRequests/index')

const serverHost = process.env.SERVER_HOST
const serverPort = process.env.SERVER_PORT

const expireCoef = require('./calculations/closeToExpire')
const createCoef = require('./calculations/createUpdate')

const url = require('url')
const server = require('http').createServer(async (req, res) => {
    try {
        if (req.method !== 'GET') return errorHandler(res, new Error('Method not allowed'), 405)
        const { domain } = url.parse(req.url, true).query
        if (!domain) return errorHandler(res, new Error('Bad request: Missing "domain" attribute'), 400)
        const rawData = await requestChain(domain)
        const { certificateInfo: { data: sslData }, domainInfo: { data: domainData } } = rawData
        const data = {
            ...rawData,
            grade: rawData.malicioutDatabase.code === 200 ? 0 : Math.min((expireCoef(sslData?.valid_from, sslData?.valid_to, Date.now()) + createCoef(domainData?.createdDate, domainData?.updatedDate, Date.now())) / 2, 1)
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(data))
    } catch (err) {
        console.log(err)
        return errorHandler(res)
    }
})
server.listen(serverPort, serverHost, () => console.log('server started'))