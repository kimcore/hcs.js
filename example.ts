// import hcs from "hcs.js"
import * as hcs from "./src"

// @ts-ignore
import Readline from 'readline'
import {CovidQuickTestResult} from "./src";

const readline = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const it = readline[Symbol.asyncIterator]()

const example = async () => {
    console.log('학교 이름을 입력해주세요.')
    const schoolName = (await it.next()).value
    const schools = await hcs.searchSchool(schoolName)
    if (schools.length === 0) {
        console.log('검색된 학교가 없습니다.')
        process.exit(0)
    }
    const school = schools[0]

    console.log('이름을 입력해주세요.')
    const name = (await it.next()).value

    console.log('생년월일 6자리를 입력해주세요.')
    const birthday = (await it.next()).value

    const login = await hcs.login(school.endpoint, school.schoolCode, name, birthday, school.searchKey)
    if (!login.success) {
        console.log('로그인에 실패했습니다.')
        process.exit(0)
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

    let token // 비밀번호로 로그인하여 새로운 토큰을 받아옵니다.
    while (true) {
        console.log('비밀번호 4자리를 입력해주세요.')
        const password = (await it.next()).value
        const secondLogin = await hcs.secondLogin(school.endpoint, login.token, password)
        if (secondLogin.success == false) {
            const fail = secondLogin

            if (fail.message) {
                console.log(fail.message)
                process.exit(0)
            }
            if (fail.remainingMinutes) {
                console.log(`5회 이상 실패하여 ${fail.remainingMinutes}분 후에 재시도가 가능합니다.`)
                continue
            }

            console.log('잘못된 비밀번호입니다. 5회 이상 실패시 5분 후에 재시도가 가능합니다.')
            console.log(`현재 ${fail.failCount}번 실패하셨습니다.`)
        } else {
            token = secondLogin.token
            break
        }
    }

    const survey = {
        /**
         * 1. 학생 본인이 코로나19 감염에 의심되는 아래의 임상증상*이 있나요?
         * (주요 임상증상) 발열(37.5℃), 기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각소실
         */
        Q1: false,

        /**
         * 2. 학생은 오늘(어제 저녁 포함) 신속항원검사(자가진단)를 실시했나요?
         */
        Q2: CovidQuickTestResult.NONE,

        /**
         * 3.학생 본인 또는 동거인이 PCR 검사를 받고 그 결과를 기다리고 있나요?
         */
        Q3: false
    }
    const result = await hcs.registerSurvey(school.endpoint, token, survey)
    console.log(`${result.registeredAt} ${login.name}님 자가진단을 완료하셨습니다.`)
    process.exit(0)
}

example().then()
