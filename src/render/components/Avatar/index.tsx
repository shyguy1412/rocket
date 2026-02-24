import style from './Avatar.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { useInstance } from '@/render/store/Instance';
import { PublicUser } from '@/schemas/api';

export namespace Avatar {
    export type Props = {
        user: PublicUser;
    };
}

const _Avatar = ({ user }: Avatar.Props) => {
    const cdn = useInstance().cdn.baseUrl;

    return <img
        class={style.avatar}
        src={`${cdn}/avatars/${user.id}/${user.avatar}`}
        alt=''
    />;
};

export const Avatar = memo(_Avatar);
