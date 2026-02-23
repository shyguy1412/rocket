import style from './UserBadge.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { PublicUser } from '@/schemas/index';
import { useInstance } from '@/render/store/Instance';

export namespace UserBadge {
    export type Props = {
        user: PublicUser;
    };
}

const _UserBadge = ({ user: profile }: UserBadge.Props) => {
    const instance = useInstance();
    console.log(instance);
    return <div class={style.badge}>
        <img
            src={`${instance.cdn.baseUrl}/avatars/${profile.id}/${profile.avatar}`}
            alt=''
        />
        {profile.username}
        <br />
        {instance.api.baseUrl}
    </div>;
};

export const UserBadge = memo(_UserBadge);
