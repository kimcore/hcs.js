# hcs.js

[![npm version](https://img.shields.io/npm/v/hcs.js.svg?style=round-square)](https://www.npmjs.org/package/hcs.js)
[![install size](https://packagephobia.com/badge?p=hcs.js)](https://packagephobia.com/result?p=hcs.js)
[![npm downloads](https://img.shields.io/npm/dm/hcs.js.svg?style=round-square)](http://npm-stat.com/charts.html?package=hcs.js)
[![image](https://img.shields.io/github/license/kimcore/hcs.js)](https://github.com/kimcore/hcs.js/blob/master/LICENSE)

교육부 학생 건강상태 자가진단 라이브러리

# 설치

```bash
npm install hcs.js
```

CommonJS
```js
const hcs = require('hcs.js');
```

ES
```js
import hcs from "hcs.js";
```

# 사용
  - [학교 검색](#학교-검색)
  - [로그인(1차)](#로그인1차)
  - [개인정보 처리 방침 동의](#개인정보-처리-방침-동의)
  - [비밀번호 존재 확인](#비밀번호-존재-확인)
  - [로그인(2차)](#로그인2차)
  - [설문 제출](#설문-제출)
  - [학생 정보 불러오기](#학생-정보-불러오기)
  - [사용 예시](#사용-예시)

## 학교 검색
학교를 검색합니다.

```js
hcs.searchSchool('<학교 이름>');
```

async/await
```js
const schoolList = await hcs.searchSchool('서울과학고');
```
.then()
```js
hcs.searchSchool('서울과학고').then(schoolList => {
  // schoolList
});
```

`schoolList`

성공
```js
[{
  "name": "서울과학고등학교", // 학교 이름
  "nameEn": "Seoul Science High School", // 학교 이름(영어)
  "city": "서울특별시", // 학교 지역
  "address": "(03066)서울특별시 종로구 혜화로 63 (명륜1가)", // 학교 주소
  "endpoint": "senhcs.eduro.go.kr", // 지역 endpoint
  "schoolCode": "B100000569" // 학교 코드
},
{
  // ...
},
// 최대 30개
]
```

실패
```js
[]
```

## 로그인(1차)
학생 이름과 생년월일로 1차 로그인을 하여 토큰을 받아옵니다.

```js
const school = schoolList[0]; // 위 hcs.searchSchool()에서 받은 결과
```

async/await
```js
const firstLogin = await hcs.login(school.endpoint, school.schoolCode, '<학생 이름>', '<학생 생년월일(6자리)>');
```
.then()
```js
hcs.login(school.endpoint, school.schoolCode, '<학생 이름>', '<학생 생년월일(6자리)>').then(firstLogin => {
  // firstLogin
});
```

`firstLogin`

성공
```js
{
  "success": true, // 성공 여부
  "agreementRequired": false, // 개인정보 처리 방침 동의 필요 여부
  "schoolName": "서울과학고등학교", // 학교 이름
  "name": "홍길동", // 학생 이름
  "birthday": "030512", // 학생 생년월일
  "token": "Bearer ..." // 로그인 토큰
}
```

실패
```js
{
  "success": false, // 성공 여부
  "message": "소속학교(기관)에 사용자 정보 확인 후 다시 시도하십시오." // 학교에 해당 학생이 등록되어 있지 않거나 학생 정보가 잘못됨
}
```

## 개인정보 처리 방침 동의
개인정보 처리 방침에 동의하지 않았을 경우 동의합니다.

```js
if(firstLogin.agreementRequired) { // 위 hcs.login()에서 받은 결과
  await hcs.updateAgreement(school.endpoint, firstLogin.token);
}
```

## 비밀번호 존재 확인
학생이 비밀번호를 설정했는지 확인힙니다.

async/await
```js
const passwordExists = await hcs.passwordExists(school.endpoint, firstLogin.token);
```
.then()
```js
await hcs.passwordExists(school.endpoint, firstLogin.token).then(passwordExists => {
  // passwordExists
});
```

`passwordExists`

```js
if(!passwordExists) {
  await hcs.registerPassword(school.endpoint, firstLogin.token, '<비밀번호(4자리)>'); // 비밀번호를 설정합니다.
}
```

## 로그인(2차)
비밀번호로 2차 로그인을 하여 새로운 토큰을 받아옵니다.

```js
let secondToken;
```

async/await
```js
const secondLogin = await hcs.secondLogin(school.endpoint, firstLogin.token, '<비밀번호(4자리)>');
secondToken = secondLogin.token;
```
.then()
```js
hcs.secondLogin(school.endpoint, firstLogin.token, '<비밀번호(4자리)>').then(secondLogin => {
  secondToken = secondLogin.token;
});
```

`secondLogin`

성공
```js
{
  "success": true, // 성공 여부
  "token": "Bearer ..." // 로그인 토큰
}
```

실패
```js
{
  "success": false, // 성공 여부
  "failCount": 1, // 실패 횟수
  "remainingMinutes": 0, // 5번 이상 실패했을 경우 다음 시도까지 남은 시간(분)
  "message": "사용자 비밀번호가 맞지 않습니다. 본인이나 가족이 이미 설정한 비밀번호를 입력하여 주시기 바랍니다." // 비밀번호가 올바르지 않음
}
```

## 설문 제출
자가진단 설문을 제출합니다.

```js
import {CovidQuickTestResult} from "hcs.js"

const survey = {
        /**
         * 1. 학생 본인이 코로나19 감염에 의심되는 아래의 임상증상*이 있나요?
         * (주요 임상증상) 발열(37.5℃), 기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각소실
         */
        Q1: false,

        /**
         * 2. 학생은 오늘(어제 저녁 포함) 신속항원검사(자가진단)를 실시했나요?
         */
        Q2: CovidQuickTestResult.NONE, // 0 (NONE) = 검사하지 않음, 1 (NEGATIVE) = 음성, 2 (POSITIVE) = 양성

        /**
         * 3.학생 본인 또는 동거인이 PCR 검사를 받고 그 결과를 기다리고 있나요?
         */
        Q3: false
    }
```

async/await
```js
const result = await hcs.registerSurvey(school.endpoint, secondToken, survey);
```
.then()
```js
hcs.registerSurvey(school.endpoint, secondToken, survey).then(result => {
  // result
})
```

`result`

성공
```js
{
  "success": true, // 성공 여부
  "registeredAt": "2022-03-06 15:35:38" // 자가진단 실시 시간
}
```

실패
```js
{
  "success": false, // 성공 여부
  "message": "오류 메시지"
}
```

## 학생 정보 불러오기
학생의 정보를 불러옵니다.

async/await
```js
const userInfo = await hcs.userInfo(school.endpoint, secondToken);
```
.then()
```js
hcs.userInfo(school.endpoint, secondToken).then(userInfo => {
  // userInfo
})
```

`userInfo`

오늘 자가진단을 실시했을 경우
```js
[{
  "registerRequired": false, // false = 자가진단 완료, true = 자가진단 미실시
  "registeredAt": "2022-03-06 15:35:38.963405", // 자가진단 실시 시간
  "registeredAtYMD": "20220306",
  "schoolName": "서울과학고등학교",
  "schoolCode": "B100000569",
  "isHealthy": true, // true = 정상, false = 등교 중지, undefined = 자가진단 미실시
  "name": "홍길동",
  "UID": "2022000001",
  "token": "Bearer ..."
}]
```

오늘 자가진단을 실시하지 않은 경우
```js
[{
  "registerRequired": true, // false = 자가진단 완료, true = 자가진단 미실시
  "registeredAt": undefined, // 자가진단 실시 시간
  "registeredAtYMD": undefined,
  "schoolName": "서울과학고등학교",
  "schoolCode": "B100000569",
  "isHealthy": undefined, // true = 정상, false = 등교 중지, undefined = 자가진단 미실시
  "name": "홍길동",
  "UID": "2022000001",
  "token": "Bearer ..."
}]
```

## 사용 예시
[example.ts](https://github.com/kimcore/hcs.js/blob/main/example.ts)를 참고해주세요.
