const nodeFetch = require('node-fetch')
const fetch = require("fetch-cookie")(nodeFetch)

module.exports = async (path = '/', method = 'GET', data = {}, endpoint = 'hcs.eduro.go.kr', headers = {}) => {
    data = method === 'GET' ? new URLSearchParams(data).toString() : JSON.stringify(data)
    endpoint = 'https://' + endpoint + path + (method === 'GET' ? '?' + data : '')
    const response = await fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/' + (method === 'GET' ? 'x-www-form-urlencoded' : 'json') + ';charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-GB,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4,zh;q=0.3,en-US;q=0.2',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Origin': 'https://hcs.eduro.go.kr',
            'Pragma': 'no-cache',
            'Referer': 'https://hcs.eduro.go.kr/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            'X-Requested-With': 'XMLHttpRequest',
            ...headers
        },
        body: method === 'POST' ? data : undefined
    })
    let value = await response.text()
    try {
        value = JSON.parse(value)
    } catch (ignored) {
    }
    return value
}
