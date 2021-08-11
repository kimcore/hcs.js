const Seed = require("./seed")

const encDelimiter = ","

module.exports = function SeedEnc(geo, sessionKey, initTime) {
    const iv = [0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x4b, 0x65, 0x79, 0x31, 0x30]
    const tSize = 48
    const inData = new Array(tSize)
    const outData = new Array(tSize)
    const roundKey = new Array(32)
    let i

    for (i = 0; i < geo.length; i++) {
        if (["l", "u", "#"].includes(geo.charAt(i))) {
            inData[i] = Number(geo.charCodeAt(i))
        } else {
            inData[i] = Number(geo.charAt(i).toString(16))
        }
    }

    inData[i++] = 32
    for (let k = 0; k < initTime.length; k++) {
        if (/^[\x61-\x7A]*$/.test(initTime[k])) { // isAlphabet
            inData[i++] = Number(initTime.charCodeAt(k))
        } else {
            inData[i++] = initTime[k]
        }
    }

    inData[i++] = 32
    inData[i++] = 37

    Seed.SeedRoundKey(roundKey, sessionKey)
    Seed.SeedEncryptCbc(roundKey, iv, inData, tSize, outData)

    const encodedDataString = Array.from(Array(tSize).keys())
        .map(k => Number(outData[k]).toString(16) + encDelimiter).join("")

    return encodedDataString.substring(0, encodedDataString.length - 1)
}
