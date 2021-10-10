import request from "./request"
import {userInfo} from "./userInfo"

/** 설문 내용 */
export interface SurveyData {
    /** 학생 본인이 37.5도 이상 발열 또는 발열감이 있나요? */
    Q1: boolean

    /** 학생에게 코로나19가 의심되는 임상증상이 있나요?
     * (기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각 소실 또는 폐렴 등)
     */
    Q2: boolean

    /** 학생 본인 또는 동거인이 방역당국에 의해 현재 자가격리가 이루어지고 있나요? */
    Q3: boolean
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
    Q3: false
}): Promise<SurveyResult> {
    const user = await userInfo(endpoint, token)
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
        upperToken: user[0].token,
        upperUserNameEncpt: user[0].name
    }
    const response = await request('/registerServey', 'POST', data, endpoint, user[0].token)
    return {
        registeredAt: response['registerDtm']
    }
}
