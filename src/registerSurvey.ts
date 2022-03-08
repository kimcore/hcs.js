import request from "./request"
import {userInfo} from "./userInfo"
import {retrieveClientVersion} from "./util";

export enum CovidQuickTestResult {
    /** 검사하지 않음 */
    NONE,
    /** 음성 */
    NEGATIVE,
    /** 양성 */
    POSITIVE
}

/** 설문 내용 */
export interface SurveyData {
    /**
     * 1. 학생 본인이 코로나19 감염에 의심되는 아래의 임상증상*이 있나요?
     * * 주요 임상증상 : 발열(37.5℃), 기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각소실
     * ※ 단 학교에서 선별진료소 검사결과(음성)를 확인 후 등교를 허용한 경우, 또는 선천성질환·만성질환(천식 등)으로 인한 증상인 경우 ‘아니오’를 선택하세요
     */
    Q1: boolean

    /**
     * 2. 학생은 오늘(어제 저녁 포함) 신속항원검사(자가진단)를 실시했나요?
     * 코로나19 완치자의 경우, 확진일로부터 45일간 신속항원검사(자가진단)는 실시하지 않음(“검사하지 않음”으로 선택)
     */
    Q2: CovidQuickTestResult

    /**
     * 3.학생 본인 또는 동거인이 PCR 검사를 받고 그 결과를 기다리고 있나요?
     */
    Q3: boolean
}

/** 설문 결과 */
export interface SurveyResult {
    /** 성공 여부 */
    success: boolean
    /** 에러 메시지 */
    message?: string
    /** 설문 시각 */
    registeredAt?: string
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
    Q2: CovidQuickTestResult.NONE,
    Q3: false
}): Promise<SurveyResult> {
    const user = await userInfo(endpoint, token)
    const clientVersion = await retrieveClientVersion()
    const data = {
        clientVersion,
        deviceUuid: '',
        rspns00: (!survey.Q1 && survey.Q2 !== CovidQuickTestResult.NONE && !survey.Q3) ? 'Y' : 'N',
        rspns01: survey.Q1 ? '2' : '1',
        rspns02: survey.Q3 ? '0' : '1',
        rspns03: survey.Q2 == CovidQuickTestResult.NONE ? '1' : null,
        rspns04: null,
        rspns05: null,
        rspns06: null,
        rspns07: survey.Q2 != CovidQuickTestResult.NONE ? (survey.Q2 == CovidQuickTestResult.NEGATIVE ? '0' : '1') : null,
        rspns08: null,
        rspns09: null,
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
    if (response.isError) {
        return {
            success: false,
            message: response.message
        }
    }
    return {
        success: true,
        registeredAt: response['registerDtm']
    }
}
