import nodeFetch from "node-fetch"
import fetchCookie from "fetch-cookie"
const fetch = fetchCookie(nodeFetch)
import {Agent} from "https"
import {URLSearchParams} from "url"

export const defaultAgent = new Agent({
    rejectUnauthorized: false
})

const defaultHeaders = {
    "Accept": "application/json, text/plain, */*", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-GB,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4,zh;q=0.3,en-US;q=0.2", "Cache-Control": "no-cache", "Connection": "keep-alive", "Pragma": "no-cache", "Referer": "https://hcs.eduro.go.kr/", "X-Forwarded-For": "hcs.eduro.go.kr", "Sec-Fetch-Dest": "empty", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Site": "same-site", "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1", "X-Requested-With": "XMLHttpRequest",
}

async function request(path = "/", method = "GET", data = {}, endpoint = "hcs.eduro.go.kr", token?: string): Promise<any> {
    const query = method === "GET" ? "?" + new URLSearchParams(data).toString() : ""
    const url = "https://" + endpoint + path + query
    const response = await fetch(url, {
        method: method,
        agent: defaultAgent,
        headers: {
            "Content-Type": `application/${method === "GET" ? "x-www-form-urlencoded" : "json"};charset=UTF-8`,
            "Authorization": token,
            ...defaultHeaders,
        },
        body: method === "POST" ? JSON.stringify(data) : undefined
    })
    let value = await response.text()
    try {
        value = JSON.parse(value)
    } catch (ignored) {
    }
    return value
}

export default request
