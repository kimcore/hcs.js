const request = require('./request')

module.exports = async schoolName => {
    const response = await request('/v2/searchSchool', 'GET', {orgName: schoolName})
    const list = Object(response['schulList'])
    return list.map(school => {
        return {
            name: school['kraOrgNm'],
            nameEn: school['engOrgNm'],
            city: school['lctnScNm'],
            address: school['addres'],
            endpoint: school['atptOfcdcConctUrl'],
            schoolCode: school['orgCode']
        }
    })
}
