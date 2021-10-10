import HmacSHA256 from "crypto-js/hmac-sha256"
import fetch from "node-fetch"
import crypto from "crypto"
import encryptWithPublicKey from "./encryptWithPublicKey"
import seedEncrypt from "./seedEncrypt"
import {defaultAgent} from "../request"

const delimiter = "$"
const transkeyServlet = "https://hcs.eduro.go.kr/transkeyServlet"
const keysXY = [
    [125, 27], [165, 27], [165, 67], [165, 107],
    [165, 147], [125, 147], [85, 147], [45, 147],
    [45, 107], [45, 67], [45, 27], [85, 27]
]

async function request(url: string, body?: string): Promise<string> {
    const options = body ? {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}} : {}
    return fetch(url, {
        agent: defaultAgent,
        body,
        ...options,
    }).then(r => r.text())
}

async function buildRaon(password: string) {
    // const certPem = await fetch("https://hcs.eduro.go.kr/transkeyServlet", {
    //     method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //     body: "op=getPublicKey&TK_requestToken=0"
    // }).then(r => r.text())
    // const hexArray = _x509_getPublicKeyHexArrayFromCertPEM(certPem)
    // const publicKey = {n: hexArray[0], k: 256, e: hexArray[1]}
    const getInitTime = await request(transkeyServlet + "?op=getInitTime")
    const initTime = getInitTime.match(/var initTime='(.*)';/)[1]
    const genSessionKey = crypto.randomBytes(16).toString("hex")
    const sessionKey = genSessionKey.split("").map(char => Number("0x0" + char))
    const encSessionKey = encryptWithPublicKey(genSessionKey)
    const keyIndex = await request(transkeyServlet, `op=getKeyIndex&name=password&keyboardType=number&initTime=${initTime}`)
    const dummy = await request(transkeyServlet, `op=getDummy&keyboardType=number&fieldType=password&keyIndex=${keyIndex}&talkBack=true`)
    const keys = dummy.split(",")
    let enc = password.split("").map(n => {
        const [x, y] = keysXY[keys.indexOf(n)]
        return delimiter + seedEncrypt(`${x} ${y}`, sessionKey, initTime)
    }).join("")
    for (let j = 4; j < 128; j++) {
        enc += delimiter + seedEncrypt("# 0 0", sessionKey, initTime)
    }
    const hmac = HmacSHA256(enc, genSessionKey).toString()
    return JSON.stringify({
        raon: [{
            id: "password",
            enc,
            hmac,
            keyboardType: "number",
            keyIndex,
            fieldType: "password",
            seedKey: encSessionKey
        }]
    })
}

export default buildRaon
