import { Lumber } from '@/lib/log/Lumber';
import style from './LoadingScreen.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';

export namespace LoadingScreen {
    export type Props = {};
}

const _LoadingScreen = ({}: LoadingScreen.Props) => {
    Lumber.log(Lumber.RENDER, 'LOADINGSCREEN RENDER');

    return <div>Loading</div>;
};

export const LoadingScreen = memo(_LoadingScreen);
