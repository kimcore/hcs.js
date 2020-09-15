const fetch = require('node-fetch')

module.exports = async (path = '/', method = 'GET', data = {}, endpoint = 'hcs.eduro.go.kr', headers = {}) => {
    data = method === 'GET' ? new URLSearchParams(data).toString() : JSON.stringify(data)
    endpoint = 'https://' + endpoint + path + (method === 'GET' ? '?' + data : '')
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/' + (method === 'GET' ? 'x-www-form-urlencoded' : 'json') + ';charset=UTF-8',
            ...headers
        },
        body: method === 'POST' ? data : undefined
    })
    return response.json()
}
