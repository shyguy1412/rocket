import style from './UserBadge.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';

export namespace UserBadge {
    export type Props = {};
}

const _UserBadge = ({}: UserBadge.Props) => {
    return <div></div>;
};

export const UserBadge = memo(_UserBadge);
