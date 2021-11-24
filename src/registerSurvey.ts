import request from "./request"
import {userInfo} from "./userInfo"

/** 설문 내용 */
export interface SurveyData {
    /*
     * 1. 학생 본인이 코로나19가 의심되는 아래의 임상증상*이 있나요?
     * (주요 임상증상) 발열(37.5℃ 이상), 기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각소실
     */
    Q1: boolean

    /*
     * 2. 학생 본인 또는 동거인이 코로나19 진단검사를 받고 그 결과를 기다리고 있나요?
     */
    Q2: boolean

    /*
     * 3.학생 본인 또는 동거인이 방역당국에 의해 현재 자가격리가 이루어지고 있나요?
     */
    Q3: boolean

    /*
     * 4. 학생의 동거인 중 확진자가 있나요?
     */
    Q4: boolean
}

/** 설문 결과 */
export interface SurveyResult {
    /**  */
    registeredAt: string
}

/**
 * 설문을 진행합니다
 *
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 설문 토큰 (로그인 토큰이 아닙니다!)
 * @param survey 설문 내용
 */
export async function registerSurvey(endpoint: string, token: string, survey: SurveyData = {
    Q1: false,
    Q2: false,
    Q3: false,
    Q4: false
}): Promise<SurveyResult> {
    const user = await userInfo(endpoint, token)
    const data = {
        deviceUuid: '',
        rspns00: (!survey.Q1 && !survey.Q2 && !survey.Q3 && !survey.Q4) ? 'Y' : 'N',
        rspns01: survey.Q1 ? '2' : '1',
        rspns02: survey.Q2 ? '0' : '1',
        rspns03: null,
        rspns04: null,
        rspns05: null,
        rspns06: null,
        rspns07: null,
        rspns08: survey.Q4 ? '1' : '0',
        rspns09: survey.Q3 ? '1' : '0',
        rspns10: null,
        rspns11: null,
        rspns12: null,
        rspns13: null,
        rspns14: null,
        rspns15: null,
        upperToken: user[0].token,
        upperUserNameEncpt: user[0].name
    }
    const response = await request('/registerServey', 'POST', data, endpoint, user[0].token)
    return {
        registeredAt: response['registerDtm']
    }
}
