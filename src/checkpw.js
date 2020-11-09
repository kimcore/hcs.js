const request = require('./request')

module.exports = async (endpoint, token) => {
    return await request('/v2/hasPassword', 'POST', {}, endpoint, {'Authorization': token})
}
