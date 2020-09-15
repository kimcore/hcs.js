const request = require('./request')
const encrypt = require('./encrypt')

module.exports = async (endpoint, token, password) => {
    const data = {
        deviceUuid: '',
        password: encrypt(password)
    }
    let response = await request('/registpw', 'POST', data, endpoint, {'Authorization': token})
    return {success: response.result}
}
