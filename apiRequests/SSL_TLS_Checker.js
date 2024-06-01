const httpsRequest = require('https').request
const SSL_TLS_Check = (hostname) => {
    return new Promise((resolve, reject) => {
        try {
            const request = httpsRequest(hostname, (response) => {
                const cert = response.socket.getPeerCertificate()
                if (!cert) {
                    reject({ statusCode: 404, message: 'No certificate found' })
                    return
                }
                const { issuer, valid_from, valid_to } = cert
                resolve({
                    country: issuer?.C,
                    organization: issuer?.O,
                    commonName: issuer?.CN,
                    valid_from,
                    valid_to
                })
            })
            const timeout = setTimeout(() => {
                request.abort()
                reject({ statusCode: 504, message: 'Connection timeout' })
            }, 3000)
            request.on('error', e => reject({ statusCode: 500, message: e.message }))
            request.end(() => {
                clearTimeout(timeout)
            }
            )
        } catch (e) {
            reject({ statusCode: 500, message: e.message })
        }
    })
}

module.exports = { SSL_TLS_Check }
