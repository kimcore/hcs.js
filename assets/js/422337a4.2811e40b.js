"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[373],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(r),f=o,m=d["".concat(u,".").concat(f)]||d[f]||p[f]||a;return r?n.createElement(m,i(i({ref:t},l),{},{components:r})):n.createElement(m,i({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6501:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return u},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return p}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],s={sidebar_position:5},u="\uc124\ubb38 \uc81c\ucd9c",c={unversionedId:"methods/registerSurvey",id:"methods/registerSurvey",title:"\uc124\ubb38 \uc81c\ucd9c",description:"\uc124\ubb38\uc744 \uc81c\ucd9c\ud569\ub2c8\ub2e4.",source:"@site/docs/methods/registerSurvey.mdx",sourceDirName:"methods",slug:"/methods/registerSurvey",permalink:"/docs/methods/registerSurvey",editUrl:"https://github.com/kimcore/hcs.js/tree/main/docs/docs/methods/registerSurvey.mdx",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"sidebar",previous:{title:"\uac1c\uc778\uc815\ubcf4\ucc98\ub9ac\ubc29\uce68 \ub3d9\uc758",permalink:"/docs/methods/updateAgreement"}},l={},p=[{value:"\uc0ac\uc6a9\ubc95",id:"\uc0ac\uc6a9\ubc95",level:3},{value:"\uacb0\uacfc \uc608\uc2dc",id:"\uacb0\uacfc-\uc608\uc2dc",level:3},{value:"\uc131\uacf5",id:"\uc131\uacf5",level:4},{value:"\uc2e4\ud328",id:"\uc2e4\ud328",level:4}],d={toc:p};function f(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"\uc124\ubb38-\uc81c\ucd9c"},"\uc124\ubb38 \uc81c\ucd9c"),(0,a.kt)("p",null,"\uc124\ubb38\uc744 \uc81c\ucd9c\ud569\ub2c8\ub2e4."),(0,a.kt)("h3",{id:"\uc0ac\uc6a9\ubc95"},"\uc0ac\uc6a9\ubc95"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import {CovidQuickTestResult, SurveyData} from "hcs.js"\n\nconst survey: SurveyData = {\n    Q1: false,\n    Q2: CovidQuickTestResult.NONE,\n    Q3: false\n}\nconst result = await hcs.registerSurvey(school.endpoint, login.token, survey)\n')),(0,a.kt)("h3",{id:"\uacb0\uacfc-\uc608\uc2dc"},"\uacb0\uacfc \uc608\uc2dc"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/api/SurveyResult"},"SurveyResult"),"\uac00 \ubc18\ud658\ub429\ub2c8\ub2e4."),(0,a.kt)("h4",{id:"\uc131\uacf5"},"\uc131\uacf5"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'{\n  success: true,\n  registeredAt: "2022-03-06 15:35:38" // \uc790\uac00\uc9c4\ub2e8 \uc2e4\uc2dc \uc2dc\uac04\n}\n')),(0,a.kt)("h4",{id:"\uc2e4\ud328"},"\uc2e4\ud328"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'{\n  success: false,\n  message: "\uc624\ub958 \uba54\uc2dc\uc9c0"\n}\n')))}f.isMDXComponent=!0}}]);