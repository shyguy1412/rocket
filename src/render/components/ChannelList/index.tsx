import style from './ChannelList.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';

export namespace ChannelList {
    export type Props = {};
}

const _ChannelList = ({}: ChannelList.Props) => {
    return <div></div>;
};

export const ChannelList = memo(_ChannelList);
