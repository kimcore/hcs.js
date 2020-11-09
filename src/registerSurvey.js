const request = require('./request')

module.exports = async (endpoint, token, survey = {
    Q1: false,
    Q2: false,
    Q3: false
}) => {
    const data = {
        deviceUuid: '',
        rspns00: (!survey.Q1 && !survey.Q2 && !survey.Q3) ? 'Y' : 'N',
        rspns01: survey.Q1 ? '2' : '1',
        rspns02: survey.Q2 ? '0' : '1',
        rspns03: null,
        rspns04: null,
        rspns05: null,
        rspns06: null,
        rspns07: null,
        rspns08: null,
        rspns09: survey.Q3 ? '1' : '0',
        rspns10: null,
        rspns11: null,
        rspns12: null,
        rspns13: null,
        rspns14: null,
        rspns15: null,
    }
    const response = await request('/registerServey', 'POST', data, endpoint, {'Authorization': token})
    return {
        registeredAt: response['registerDtm']
    }
}
