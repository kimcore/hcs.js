# hcs.js
[![install size](https://packagephobia.com/badge?p=hcs.js)](https://packagephobia.com/result?p=hcs.js)
[![image](https://img.shields.io/github/license/kimcore/hcs.js)](https://github.com/kimcore/hcs.js/blob/master/LICENSE)

[![image](https://nodei.co/npm/hcs.js.png?downloads=true&stars=true)](https://nodei.co/npm/hcs.js/)

> 가상 키보드에 대응합니다! v1.1.3 부터는 최적화된 코드를 제공합니다.

교육부 학생 건강상태 자가진단 라이브러리입니다.

현재 문서는 따로 없으며, [example.js](https://github.com/kimcore/hcs.js/blob/master/example.js)를 참고해주시면 감사하겠습니다.

### 프록시 사용법
`https-proxy-agent` 라이브러리를 통해 프록시를 사용하실 수 있습니다.
상세한 사용법은 [https-proxy-agent])(https://github.com/TooTallNate/node-https-proxy-agent) 레포에서 확인해주세요.
```js
const HttpsProxyAgent = require('https-proxy-agent');

const agent = new HttpsProxyAgent("http://123.456.789.123:8080") // Proxy URI
hcs.setAgent(agent)
```
