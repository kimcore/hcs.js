import fetchHcs from "./util/fetchHcs"
import encrypt from "./util/encrypt"
import buildRaon from "./util/buildRaon";

/**
 * 로그인 결과
 */
export type LoginResult = LoginResultSuccess | LoginResultFailure

/**
 * 로그인 성공 결과
 */
export interface LoginResultSuccess {
    /**
     * 성공 여부, 참/거짓에 따라 제공되는 데이터가 다릅니다.
     *
     * @example if (result.success) {
     *      // 로그인 성공 데이터
     *    } else {
     *      // 로그인 실패 데이터
     *    }
     * */
    success: true
    /** 동의 필요 여부 */
    agreementRequired: boolean
    /** 학교명 */
    schoolName: string
    /** 학생명 */
    name: string
    /** 생년월일 */
    birthday: string
    /** 토큰 */
    token: string
}

/**
 * 로그인 실패 결과
 */
export interface LoginResultFailure {
    /**
     * 성공 여부, 참/거짓에 따라 제공되는 데이터가 다릅니다.
     *
     * @example if (result.success) {
     *      // 로그인 성공 데이터
     *    } else {
     *      // 로그인 실패 데이터
     *    }
     * */
    success: false
    /** 로그인 실패 횟수 */
    failCount?: number
    /** 남은 시간 */
    remainingMinutes?: number
    /** 실패 사유 */
    message: string
}

/**
 * 1차 로그인을 진행합니다.
 * @param endpoint 관할 시/도 엔드포인트
 * @param schoolCode 학교식별번호
 * @param name 학생명
 * @param birthday 생년월일
 * @param searchKey 학교 검색 인증 키
 * @param password 비밀번호
 * @returns {Promise<LoginResult>}
 */
export async function login(endpoint: string, schoolCode: string, name: string, birthday: string, searchKey: string, password: string): Promise<LoginResult> {
    const data = {
        birthday: encrypt(birthday),
        deviceUuid: '',
        loginType: 'school',
        makeSession: true,
        name: encrypt(name),
        orgCode: schoolCode,
        orgName: null,
        password: await buildRaon(password),
        searchKey: searchKey,
        stdntPNo: null
    }
    const response = await fetchHcs('/v3/findUser', 'POST', data, endpoint)
    if (response['isError']) {
        if (!response.token) {
            return {success: false, message: response['message']}
        }

        if (response.message == "비밀번호를 다시한번더 입력해주세요") {
            return {
                success: false,
                failCount: null,
                remainingMinutes: null,
                message: "가상키보드 오류"
            }
        }

        let message = null
        if (response.statusCode == 252) {
            switch (response.errorCode) {
                case 1e3:
                    message = "비밀번호를 5회 틀리셔서 5분후 재시도 하실 수 있습니다."
                    break
                case 1001:
                    if (!response.data.canInitPassword) {
                        message = "사용자 비밀번호가 맞지 않습니다. 본인이나 가족이 이미 설정한 비밀번호를 입력하여 주시기 바랍니다."
                    }
                    break
                case 1003:
                    message = "비밀번호가 초기화 되었습니다. 다시 로그인하세요"
            }
        } else if (response.statusCode == 255) {
            switch (response.errorCode) {
                case 1004:
                    message = "입력시간이 초과되어 다시 비밀번호를 입력하시기 바랍니다."
            }
        }

        return {
            success: false,
            failCount: response.data.failCnt ? Number(response.data.failCnt) : 5,
            remainingMinutes: response.data.remainMinutes ? Number(response.data.remainMinutes) : 0,
            message
        }
    }

    return {
        success: true,
        agreementRequired: response['pInfAgrmYn'] === 'N',
        schoolName: response['orgName'],
        name: response['userName'],
        birthday: birthday,
        token: response['token']
    }
}
