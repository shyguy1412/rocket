// import { getGuilds } from '@/api/users/@me/guilds';
// import { useInstance } from '@/render/store/Instance';
// import { APIGuildArray } from '@/schemas/responses';
// import { createStore } from '@xstate/store';
// import { useSelector } from '@xstate/store-react';
// import { useEffect, useMemo } from 'preact/hooks';

import { useApi } from '@/api';
import { getGuilds } from '@/api/users/@me/guilds';
import { useInstance } from '@/render/store/Instance';
import { GuildStore } from '@/render/store/Profile/Guild';
import { useSelector } from '@xstate/store-react';
import { useEffect, useMemo } from 'preact/hooks';

// export const GuildStore = createStore({
//     context: { guilds: undefined as APIGuildArray | undefined },
//     on: {
//         setGuilds: (context, { guilds }: { guilds: APIGuildArray }) => {
//             return { guilds };
//         },
//     },
// });
