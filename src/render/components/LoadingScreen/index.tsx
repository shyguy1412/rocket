import style from './LoadingScreen.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';

export namespace LoadingScreen {
    export type Props = {};
}

const LoadingScreenComponent = ({}: LoadingScreen.Props) => {
    return <div>Loading</div>;
};

export const LoadingScreen = memo(LoadingScreenComponent);
