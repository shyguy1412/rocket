import style from './Avatar.module.css';

import { h } from 'preact';
import { memo, useMemo } from 'preact/compat';

import { useInstance } from '@/render/store/Instance';
import { PublicUser } from '@/schemas/api';

export namespace Avatar {
    export type Props = {
        user: PublicUser;
    };
}

const _Avatar = ({ user }: Avatar.Props) => {
    //prevents cdn url to go invalid when navigating to a guild on a different instance
    const cdn = useMemo(() => useInstance().cdn.baseUrl, [user]);

    const src = user.avatar ?
        `${cdn}/avatars/${user.id}/${user.avatar}` :
        `${cdn}/embed/avatars/${user.id.at(-1) % 5}`;

    return <img
        class={style.avatar}
        src={src}
        alt=''
    />;
};

export const Avatar = memo(_Avatar);
