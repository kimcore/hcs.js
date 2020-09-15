const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const it = readline[Symbol.asyncIterator]();
const hcs = require('./src')
// const hcs = require('hcs.js')

const example = async () => {
    console.log('학교 이름을 입력해주세요.')
    const schoolName = (await it.next()).value
    const schools = Array(await hcs.searchSchool(schoolName))
    if (schools.length === 0) {
        console.log('검색된 학교가 없습니다.')
        return
    }
    const school = schools[0]

    console.log('이름을 입력해주세요.')
    const name = (await it.next()).value

    console.log('생년월일 6자리를 입력해주세요.')
    const birthday = (await it.next()).value

    const login = await hcs.login(school.endpoint, school.schoolCode, name, birthday)
    if (!login.success) {
        console.log('로그인에 실패했습니다.')
        return
    }
    if (login.agreementRequired) {
        console.log('개인정보 처리 방침 (https://hcs.eduro.go.kr/agreement) 에 동의하십니까? 동의하실 경우, 엔터를 눌러주세요.')
        await it.next()
        await hcs.updateAgreement(school.endpoint, login.token)
    }

    const passwordExists = await hcs.passwordExists(school.endpoint, login.token)
    if (!passwordExists) {
        console.log('자가진단 시스템에 로그인할때 사용할 비밀번호 4자리를 설정합니다.')
        let password
        while (true) {
            console.log('사용할 비밀번호를 입력한 후, 엔터를 눌러주세요.')
            password = (await it.next()).value
            if (password.length !== 4 || password.replace(/[^\d]/g, '') === '') {
                console.log('비밀번호는 숫자 4자리만 허용됩니다.')
            } else break
        }
        await hcs.registerPassword(school.endpoint, login.token, password)
    }

    while (true) {
        console.log('비밀번호 4자리를 입력해주세요.')
        const password = (await it.next()).value
        const secondLogin = await hcs.secondLogin(school.endpoint, login.token, password)
        if (secondLogin.success) break
        if (secondLogin.remainingMinutes !== 0) {
            console.log(`5회 이상 실패하여 ${secondLogin.remainingMinutes}분 후에 재시도가 가능합니다.`)
            continue
        }
        console.log('잘못된 비밀번호입니다. 5회 이상 실패시 5분 후에 재시도가 가능합니다.')
        console.log(`현재 ${secondLogin.failCount}번 실패하셨습니다.`)
    }

    const survey = {
        // 학생의 몸에 열이 있나요?
        Q1: false,

        // 학생에게 코로나19가 의심되는 증상이 있나요 ?
        // 없을경우 false, 있을경우 [기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각 소실] (true or false)
        Q2: false,

        // 학생이 최근(14일 이내) 해외여행을 다녀온 사실이 있나요?
        Q3: false,

        // 동거가족 중 최근(14일 이내) 해외여행을 다녀온 사실이 있나요?
        Q4: false,

        // 동거가족 중 현재 자가격리 중 인 가족이 있나요?
        Q5: false
    }
    const result = await hcs.registerSurvey(school.endpoint, login.token, survey)
    console.log(`${result.registeredAt} ${login.name}님 자가진단을 완료하셨습니다.`)
}

example().then(console.log)
