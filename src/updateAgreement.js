const request = require('./request')

module.exports = async (endpoint, token) => {
    await request('/updatePInfAgrmYn', 'POST', {}, endpoint, {'Authorization': token})
    return {success: true}
}
