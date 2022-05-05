// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight')
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl')

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'hcs.js',
    tagline: '교육부 학생 건강상태 자가진단 라이브러리',
    url: 'https://hcs.js.org',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'kimcore',
    projectName: 'hcs.js',
    i18n: {
        defaultLocale: 'ko',
        locales: ['ko']
    },
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/kimcore/hcs.js/tree/main/docs/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                gtag: {
                    trackingID: 'G-8VWQ0ML2XS',
                    anonymizeIP: true,
                }
            })
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            metadata: [
                {name: 'keywords', content: 'hcs.js, 교육부, 학생, 건강상태, 자가진단, 자가체크'},
                {name: 'google-site-verification', content: 'bbN5D8ZrvozRVSsNV2pgXNnil2u4uBKENTTMUJZGhSg'}
            ],
            navbar: {
                title: "hcs.js",
                logo: {
                    alt: 'hcs.js Logo',
                    src: 'img/icon.png',
                },
                items: [
                    {
                        to: '/docs/install',
                        position: 'left',
                        label: '설치',
                    },
                    {
                        type: 'doc',
                        docId: 'methods/searchSchool',
                        position: 'left',
                        label: '문서',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'api',
                        position: 'left',
                        label: 'API',
                    },
                    {
                        href: 'https://github.com/kimcore/hcs.js',
                        position: 'right',
                        className: 'header-github-link',
                        'aria-label': 'GitHub repository',
                    }
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'hcs.js',
                        items: [
                            {
                                label: '설치',
                                to: '/docs/install',
                            },
                            {
                                label: '문서',
                                to: '/docs/methods/searchSchool'
                            },
                            {
                                label: 'API',
                                to: '/docs/api/School',
                            },
                        ],
                    },
                    {
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/kimcore/hcs.js',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/kimcore" target="_blank">kimcore</a>`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
}

module.exports = config
