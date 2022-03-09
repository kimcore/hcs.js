import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type StepItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const StepList: StepItem[] = [
    {
        title: '1',
        Svg: require('@site/static/img/undraw_insert_re_s97w.svg').default,
        description: (
            <>
                이름, 생년월일, 학교 정보를 사용하여<br/>
                1차 로그인을 진행합니다.
            </>
        ),
    },
    {
        title: '2',
        Svg: require('@site/static/img/undraw_security_re_a2rk.svg').default,
        description: (
            <>
                비밀번호를 사용한 2차 로그인을 진행합니다.<br/>
                보안키보드는 라이브러리 내에서 처리됩니다.
            </>
        ),
    },
    {
        title: '3',
        Svg: require('@site/static/img/undraw_certificate_re_yadi.svg').default,
        description: (
            <>
                자가진단 설문을 제출합니다!
            </>
        ),
    },
];

function Step({title, Svg, description}: StepItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.stepSvg} role="img"/>
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageSteps(): JSX.Element {
    return (
        <section className={styles.steps}>
            <div className="container">
                <div className="row">
                    {StepList.map((props, idx) => (
                        <Step key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
