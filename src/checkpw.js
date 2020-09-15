const request = require('./request')

module.exports = async (endpoint, token) => {
    const response = await request('/checkpw', 'POST', {}, endpoint, {'Authorization': token})
    return response['sndLogin']['existsYn']
}
