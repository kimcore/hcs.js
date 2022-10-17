import nodeFetch from "node-fetch"
import fetchCookie from "fetch-cookie"
import {Agent} from "https"
import {URLSearchParams} from "url"
import randomUseragent from "random-useragent"

const fetch = fetchCookie(nodeFetch)
export const defaultAgent = new Agent({
    rejectUnauthorized: false
})

function getHeaders() {
    return {
        "Accept": "application/json, text/plain, */*", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-GB,en;q=0.9,ko-KR;q=0.8,ko;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4,zh;q=0.3,en-US;q=0.2", "Cache-Control": "no-cache", "Connection": "keep-alive", "Pragma": "no-cache", "Referer": "https://hcs.eduro.go.kr/", "Sec-Fetch-Dest": "empty", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Site": "same-site", "X-Forwarded-For": "218.144." +  Array(2).fill(0).map((_, i) => Math.floor(Math.random() * 254) + (i === 1 ? 1 : 0)).join('.'), "User-Agent": randomUseragent.getRandom(), "X-Requested-With": "XMLHttpRequest",
    }
}

export default async function fetchHcs(path = "/", method = "GET", data = {}, endpoint = "hcs.eduro.go.kr", token?: string): Promise<any> {
    const query = method === "GET" ? "?" + new URLSearchParams(data).toString() : ""
    const url = "https://" + endpoint + path + query
    const response = await fetch(url, {
        method: method,
        agent: defaultAgent,
        headers: {
            "Content-Type": `application/${method === "GET" ? "x-www-form-urlencoded" : "json"};charset=UTF-8`,
            "Authorization": token,
            ...getHeaders(),
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
