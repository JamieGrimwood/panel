import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { randomInt } from '@/helpers';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';

const BarFill = styled.div`
    ${tw`h-full`};
    transition: 250ms ease-in-out;
`;

export default () => {
    const interval = useRef<number>(null);
    const timeout = useRef<number>(null);
    const [ visible, setVisible ] = useState(false);
    const rainbowBar = useStoreState(state => state.settings.data!.rainbowBar);
    const progress = useStoreState(state => state.progress.progress);
    const continuous = useStoreState(state => state.progress.continuous);
    const setProgress = useStoreActions(actions => actions.progress.setProgress);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
            interval.current && clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        setVisible((progress || 0) > 0);

        if (progress === 100) {
            // @ts-ignore
            timeout.current = setTimeout(() => setProgress(undefined), 500);
        }
    }, [ progress ]);

    useEffect(() => {
        if (!continuous) {
            interval.current && clearInterval(interval.current);
            return;
        }

        if (!progress || progress === 0) {
            setProgress(randomInt(20, 30));
        }
    }, [ continuous ]);

    useEffect(() => {
        if (continuous) {
            interval.current && clearInterval(interval.current);
            if ((progress || 0) >= 90) {
                setProgress(90);
            } else {
                // @ts-ignore
                interval.current = setTimeout(() => setProgress(progress + randomInt(1, 5)), 500);
            }
        }
    }, [ progress, continuous ]);

    return (
        <div>
            {rainbowBar === '1' ?
                <div css={tw`w-full fixed`} style={{ height: '2px' }}>
                    <CSSTransition
                        timeout={150}
                        appear
                        in={visible}
                        unmountOnExit
                        classNames={'fade'}
                    >
                        <BarFill
                            css={'background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);'}
                            style={{ width: progress === undefined ? '100%' : `${progress}%` }}
                        />
                    </CSSTransition>
                </div>
                :
                <div css={tw`w-full fixed`} style={{ height: '2px' }}>
                    <CSSTransition
                        timeout={150}
                        appear
                        in={visible}
                        unmountOnExit
                        classNames={'fade'}
                    >
                        <BarFill
                            css={'bg-cyan-400'}
                            style={{ width: progress === undefined ? '100%' : `${progress}%` }}
                        />

                    </CSSTransition>
                </div>
            }
        </div>
    );
};
