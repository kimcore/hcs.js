const request = require('./request')

module.exports = async (endpoint, token, survey = {
    Q1: false,
    Q2: false, // [false, false, false, false, false, false ,false]
    Q3: false,
    Q4: false,
    Q5: false
}) => {
    const Q2 = !survey.Q2 || (survey.Q2 instanceof Array && survey.Q2.every(it => !it))
    const data = {
        deviceUuid: '',
        rspns00: (!survey.Q1 && Q2 && !survey.Q3 && !survey.Q4 && !survey.Q5) ? 'Y' : 'N',
        rspns01: survey.Q1 ? '2' : '1',
        rspns02: Q2 ? '1' : null,
        rspns03: survey.Q2[0] ? '1' : null,
        rspns04: survey.Q2[5] ? '1' : null,
        rspns05: survey.Q2[1] ? '1' : null,
        rspns06: null,
        rspns07: survey.Q3 ? '1' : '0',
        rspns08: survey.Q4 ? '1' : '0',
        rspns09: survey.Q5 ? '1' : '0',
        rspns10: null,
        rspns11: survey.Q2[6] ? '1' : null,
        rspns12: null,
        rspns13: survey.Q2[2] ? '1' : null,
        rspns14: survey.Q2[3] ? '1' : null,
        rspns15: survey.Q2[4] ? '1' : null
    }
    const response = await request('/registerServey', 'POST', data, endpoint, {'Authorization': token})
    return {
        registeredAt: response['registerDtm']
    }
}
