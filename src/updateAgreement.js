const request = require('./request')

module.exports = async (endpoint, token) => {
    await request('/v2/updatePInfAgrmYn', 'POST', {}, endpoint, {'Authorization': token})
    return {success: true}
}
