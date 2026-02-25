import { getChannels } from '@/api/guilds/#guild_id/channels';
import { getGuilds } from '@/api/users/@me/guilds';
import { getGatewaySocket } from '@/render/lib/socket';
import { InstanceStore } from '@/render/store/Instance';
import { Profile } from '@/render/store/Profile';
import { GuildStore } from '@/render/store/Profile/Guild';
import { MessageStore } from '@/render/store/Profile/Message';
import { profile } from '@/render/views/Login/Login.module.css';

function openGateway(profile: Profile) {
    const instance = InstanceStore.get().context.instances?.find((i) =>
        i.api.baseUrl == profile.instance
    );
    if (!instance) {
        return;
    }
    const socket = getGatewaySocket(instance.gateway.baseUrl, profile.token);

    socket.addEventListener('MESSAGE_CREATE', (e) => {
        //! NOTIFICATION SERVICE
        // MessageStore.trigger.addMessages({
        //     instance: instance.api.baseUrl,
        //     messages: [e.detail],
        // });
    });

    //add service to do things
}

const map = {} as Record<string, boolean>;

export function initializeProfile(profile: Profile) {
    if (profile.token in map) {
        return;
    }
    map[profile.token] = true;
    openGateway(profile);
}
