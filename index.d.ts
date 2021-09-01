/**
 * Type definitions for the `hcs.js` module.
 * @author Park Min Hyeok <pmhstudio.pmh@gmail.com>
 * @license MIT
 */

import { Agent } from "http"

/** 학교 정보 */
export interface SchoolData {
  /** 학교명 */
  name: string
  /** 학교명(영문) */
  nameEn: string
  /** 관할 시/도 */
  city: string
  /** 학교 주소 */
  address: string
  /** 관할 시/도 엔드포인트 */
  endpoint: string
  /** 학교식별번호 */
  schoolCode: string
}

/** 학생정보 */
export interface UserData {
  /** 비밀번호 등록 필요 */
  registerRequired: boolean
  /** 등록일자 */
  registeredAt: string
  /** 등록년월일 */
  registeredAtYMD: string
  /** 학교명 */
  schoolName: string
  /** 학교식별코드 */
  schoolCode: string
  /** 설문 정상 여부 */
  isHealthy: boolean
  /** 학생명 */
  name: string
  /** 학생식별코드 */
  UID: string
  /** 로그인 세션 토큰 */
  token: string
}

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
  /** 로그인 세션 토큰 */
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
  /** 실패 사유 */
  message: string
}

export type SecondLoginResult = SecondLoginResultSuccess | SecondLoginResultFailure

export interface SecondLoginResultSuccess {
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
  /** 설문 토큰 */
  token: string
}

export interface SecondLoginResultFailure {
  /**
   * 성공 여부, 참/거짓에 따라 제공되는 데이터가 다릅니다.
   * 
   * @example if (result.success) {
   *      // 로그인 실패 데이터
   *    } else {
   *      // 로그인 성공 데이터
   *    }
   * */
  success: false
  /** 로그인 실패 횟수 */
  failCount?: number
  /** 남은 시간 */
  remainingMinutes?: number
  /** 실패 사유 */
  message?: "가상 키보드의 암호화 구조가 변경되어 현재 사용할 수 없습니다. 라이브러리 업데이트를 기다려주세요."
}

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

/**
 * 학교를 검색합니다.
 * 
 * @param schoolName 검색할 학교 이름
 */
export function searchSchool (schoolName: string): Promise<SchoolData[]>

/**
 * 로그인을 진행하고 토큰을 반환합니다.
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param schoolCode 학교식별번호
 * @param name 학생명
 * @param birthday 생년월일
 */
export function login (endpoint: string, schoolCode: string, name: string, birthday: string): Promise<LoginResult>

/**
 * 동의를 진행합니다.
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 로그인 세션 토큰
 */
export function updateAgreement (endpoint: string, token: string): Promise<{success: true}>

/**
 * 비밀번호 설정 여부를 확인합니다.
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 로그인 세션 토큰
 */
export function passwordExists (endpoint: string, token: string): Promise<boolean>

/**
 * 비밀번호를 설정합니다.
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 로그인 세션 토큰
 * @param password 비밀번호
 */
export function registerPassword (endpoint: string, token: string, password: string): Promise<{ success: boolean }>

/**
 * 제공된 비밀번호로 설문 토큰을 발급합니다.
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 로그인 세션 토큰
 * @param password 비밀번호
 */
export function secondLogin (endpoint: string, token: string, password: string): Promise<SecondLoginResult>

/**
 * 학생 정보를 가져옵니다.
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 로그인 세션 토큰
 */
export function userInfo (endpoint: string, token: string): Promise<UserData[]>

/**
 * 설문을 진행합니다
 * 
 * @param endpoint 관할 시/도 엔드포인트
 * @param token 설문 토큰 (로그인 토큰이 아닙니다!)
 * @param survey 설문 내용
 */
export function registerSurvey (endpoint: string, token: string, survey?: SurveyData): Promise<{ registeredAt: string }>

export function setAgent (httpAgent: Agent): void
