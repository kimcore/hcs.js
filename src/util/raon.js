const HmacSHA256 = require("crypto-js/hmac-sha256")
const fetch = require("node-fetch")
const crypto = require("crypto")
const encrypt = require('./encrypt')
const SeedEnc = require("./seedenc")

const delimiter = "$"
const traskeyServlet = "https://hcs.eduro.go.kr/transkeyServlet"

module.exports = async (password) => {
    // const certPem = await fetch("https://hcs.eduro.go.kr/transkeyServlet", {
    //     method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //     body: "op=getPublicKey&TK_requestToken=0"
    // }).then(r => r.text())
    // const hexArray = _x509_getPublicKeyHexArrayFromCertPEM(certPem)
    // const publicKey = {n: hexArray[0], k: 256, e: hexArray[1]}
    const publicKey = {
        n: "00e58d6a1c010cf703505cb454520876b0e2a2e0c732652b18824d367c3a7b420ad56e148c84484ff48e1efcfc4534fe1e8773f57e07b5bb0f9880349978db85c2bbbc39ccf2ef899dd8ae56fa6401b4f3a1eace450cda1b0412752e4a7b163d85e35a3d87a8f50588f336bcfde8f10c616998f8475b54e139a5f62b875ebb46a4bd21c0bac7dacce227bfe6b08da53849118c61958dd17b5cedd96b898cfd0b6cabcceaa971c634456530c5cc0a7a99152e34abd2857387cc6cbddf6c393d035da9ac960232ae5f7dcc4f62d776235d46076a871e79d5527e40e74a8199f03bd1b342e415c3c647afb45820fa270e871379b183bde974ed13e1bd8b467f0d1729",
        k: 256,
        e: "010001"
    }
    const getInitTime = await fetch(traskeyServlet + "?op=getInitTime").then(r => r.text())
    const initTime = getInitTime.match(/var initTime='(.*)';/)[1]
    const genSessionKey = crypto.randomBytes(16).toString("hex")
    const sessionKey = genSessionKey.split("").map(char => "0x0" + char)
    const encSessionKey = encrypt(genSessionKey, publicKey)
    const keyIndex = await fetch(traskeyServlet, {
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `op=getKeyIndex&name=password&keyboardType=number&initTime=${initTime}`
    }).then(r => r.text())
    const dummy = await fetch(traskeyServlet, {
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `op=getDummy&keyboardType=number&fieldType=password&keyIndex=${keyIndex}&talkBack=true`
    }).then(r => r.text())
    const keysXY = [
        [125, 27], [165, 27], [165, 67], [165, 107],
        [165, 147], [125, 147], [85, 147], [45, 147],
        [45, 107], [45, 67], [45, 27], [85, 27]
    ]
    const keys = dummy.split(",")
    let enc = password.split("").map(n => {
        const [x, y] = keysXY[keys.indexOf(n)]
        return delimiter + SeedEnc(`${x} ${y}`, sessionKey, initTime)
    }).join("")
    for (let j = 4; j < 128; j++) {
        enc += delimiter + SeedEnc("# 0 0", sessionKey, initTime)
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
