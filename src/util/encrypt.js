const jsbn = require("jsbn")
const SecureRandom = jsbn.SecureRandom.prototype
const BigInteger = jsbn.BigInteger

Number.prototype.toHexStr = function () {
    let s = ""
    for (let i = 7; i >= 0; i--) {
        s += ((this >>> (i * 4)) & 0xf).toString(16)
    }
    return s
}

function pack(source) {
    let temp = ""
    for (let i = 0; i < source.length; i += 2) {
        temp += String.fromCharCode(parseInt(source.substring(i, i + 2), 16))
    }
    return temp
}

function xor(a, b) {
    let length = Math.min(a.length, b.length)
    let temp = ""
    for (let i = 0; i < length; i++) {
        temp += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i))
    }
    length = Math.max(a.length, b.length) - length
    for (let i = 0; i < length; i++) {
        temp += "\x00"
    }
    return temp
}

function sha1Hash(msg) {
    const K = [1518500249, 1859775393, 2400959708, 3395469782]
    msg += String.fromCharCode(128)
    const l = msg.length / 4 + 2
    const N = Math.ceil(l / 16)
    const M = new Array(N)
    for (let i = 0; i < N; i++) {
        M[i] = new Array(16)
        for (let j = 0; j < 16; j++) {
            M[i][j] =
                (msg.charCodeAt(i * 64 + j * 4) << 24) |
                (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) |
                (msg.charCodeAt(i * 64 + j * 4 + 3))
        }
    }
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32)
    M[N - 1][14] = Math.floor(M[N - 1][14])
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff
    let H0 = 0x67452301
    let H1 = 0xefcdab89
    let H2 = 0x98badcfe
    let H3 = 0x10325476
    let H4 = 0xc3d2e1f0
    const W = new Array(80)
    let a, b, c, d, e
    for (let i = 0; i < N; i++) {
        for (let t = 0; t < 16; t++) {
            W[t] = M[i][t]
        }
        for (let t = 16; t < 80; t++) {
            W[t] = rotl(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1)
        }
        a = H0
        b = H1
        c = H2
        d = H3
        e = H4
        for (let t = 0; t < 80; t++) {
            const s = Math.floor(t / 20)
            const T = (rotl(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff
            e = d
            d = c
            c = rotl(b, 30)
            b = a
            a = T
        }
        H0 = (H0 + a) & 0xffffffff
        H1 = (H1 + b) & 0xffffffff
        H2 = (H2 + c) & 0xffffffff
        H3 = (H3 + d) & 0xffffffff
        H4 = (H4 + e) & 0xffffffff
    }
    return H0.toHexStr() + H1.toHexStr() + H2.toHexStr() + H3.toHexStr() + H4.toHexStr()
}

function f(s, x, y, z) {
    switch (s) {
        case 0:
            return (x & y) ^ (~x & z)
        case 1:
            return x ^ y ^ z
        case 2:
            return (x & y) ^ (x & z) ^ (y & z)
        case 3:
            return x ^ y ^ z
    }
}

function rotl(x, n) {
    return (x << n) | (x >>> (32 - n))
}

function mgf1(mgfSeed, maskLen) {
    let t = ""
    const hLen = 20
    const count = Math.ceil(maskLen / hLen)
    for (let i = 0; i < count; i++) {
        const c = String.fromCharCode((i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF)
        t += pack(sha1Hash(mgfSeed + c))
    }

    return t.substring(0, maskLen)
}

module.exports = (plaintext, publicKey) => {
    const {k, e, n} = publicKey
    const temp = new Array(32)
    SecureRandom.nextBytes(temp)

    const eb = new BigInteger(e, 16)
    const nb = new BigInteger(n, 16)

    let encrypted = ""

    while (encrypted.length < 512) {
        const hLen = 20
        const mLen = plaintext.length
        if (mLen > k - 2 * hLen - 2) {
            throw Error("too long")
        }

        const lHash = pack(sha1Hash(""))

        let ps = ""
        let temp = k - mLen - 2 * hLen - 2
        for (let i = 0; i < temp; i++) {
            ps += "\x00"
        }

        const db = lHash + ps + "\x01" + plaintext
        let seed = ""
        for (let i = 0; i < hLen + 4; i += 4) {
            temp = new Array(4)
            SecureRandom.nextBytes(temp)
            seed += String.fromCharCode(temp[0], temp[1], temp[2], temp[3])
        }
        seed = seed.substring(4 - seed.length % 4)
        const dbMask = mgf1(seed, k - hLen - 1)
        const maskedDB = xor(db, dbMask)
        const seedMask = mgf1(maskedDB, hLen)
        const maskedSeed = xor(seed, seedMask)
        const em = "\x00" + maskedSeed + maskedDB

        plaintext = []
        for (let i = 0; i < em.length; i++) {
            plaintext[i] = em.charCodeAt(i)
        }
        plaintext = new BigInteger(plaintext, 256)
        let c = plaintext.modPow(eb, nb).toString(16)
        if (c.length & 1) {
            c = "0" + c
        }
        encrypted += c
        if (encrypted.length > 511) break
    }

    return encrypted
}
