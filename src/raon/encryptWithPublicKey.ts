import jsbn from "jsbn"

const SecureRandom = jsbn.SecureRandom.prototype
const BigInteger = jsbn.BigInteger
const publicKey = {
    n: "00e58d6a1c010cf703505cb454520876b0e2a2e0c732652b18824d367c3a7b420ad56e148c84484ff48e1efcfc4534fe1e8773f57e07b5bb0f9880349978db85c2bbbc39ccf2ef899dd8ae56fa6401b4f3a1eace450cda1b0412752e4a7b163d85e35a3d87a8f50588f336bcfde8f10c616998f8475b54e139a5f62b875ebb46a4bd21c0bac7dacce227bfe6b08da53849118c61958dd17b5cedd96b898cfd0b6cabcceaa971c634456530c5cc0a7a99152e34abd2857387cc6cbddf6c393d035da9ac960232ae5f7dcc4f62d776235d46076a871e79d5527e40e74a8199f03bd1b342e415c3c647afb45820fa270e871379b183bde974ed13e1bd8b467f0d1729",
    k: 256,
    e: "010001"
}

function toHexString(number) {
    let s = ""
    for (let i = 7; i >= 0; i--) {
        s += ((number >>> (i * 4)) & 0xf).toString(16)
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
    return toHexString(H0) + toHexString(H1) + toHexString(H2) + toHexString(H3) + toHexString(H4)
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

function encryptWithPublicKey(plaintext: string) {
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
            throw Error("Couldn't encrypt text - too long")
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
            const bytes = new Array(4)
            SecureRandom.nextBytes(bytes)
            seed += String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
        }
        seed = seed.substring(4 - seed.length % 4)
        const dbMask = mgf1(seed, k - hLen - 1)
        const maskedDB = xor(db, dbMask)
        const seedMask = mgf1(maskedDB, hLen)
        const maskedSeed = xor(seed, seedMask)
        const em = "\x00" + maskedSeed + maskedDB

        const bi = new BigInteger(em.split("").map(char => char.charCodeAt(0)), 256)
        let c = bi.modPow(eb, nb).toString(16)
        // noinspection JSBitwiseOperatorUsage
        if (c.length & 1) {
            c = "0" + c
        }
        encrypted += c
        if (encrypted.length > 511) break
    }

    return encrypted
}

export default encryptWithPublicKey
