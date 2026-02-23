import style from './Guildbar.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';
import { Lumber } from '@/lib/log/Lumber';
import { Profile, ProfileContext, useProfile, useProfiles } from '@/render/store/Profile';
import { Guild, useGuilds } from '@/render/store/Profile/Guild';

export namespace Guildbar {
    export type Props = {};
}

const _Guildbar = ({}: Guildbar.Props) => {
    const profiles = useProfiles();

    Lumber.log(Lumber.RENDER, 'GUILDBAR RENDER');

    return <div class={style.guildbar}>
        {profiles.map((profile, key) =>
            <ProfileContext.Provider value={profile}>
                <ProfileGuilds key={key}></ProfileGuilds>
            </ProfileContext.Provider>
        )}
    </div>;
};
export const Guildbar = memo(_Guildbar);

namespace ProfileGuilds {
    export type Props = {
        // profile: Profile;
    };
}

const createGuildUID = (profile: Profile, guild: Guild) =>
    `${profile.token}::${guild.guild.id}`;

const _ProfileGuilds = ({}: ProfileGuilds.Props) => {
    const { setRoute } = useRouter(GuildRouter);
    const guilds = useGuilds();
    const profile = useProfile();

    Lumber.log(Lumber.RENDER, 'ProfileGuilds RENDER');

    console.log(guilds);

    return <ul class={''}>
        {guilds.map((guild, key) =>
            <li
                key={key}
                onClick={() => setRoute(createGuildUID(profile, guild))}
            >
                {guild.guild.name}
            </li>
        )}
    </ul>;
};
export const ProfileGuilds = memo(_ProfileGuilds);
