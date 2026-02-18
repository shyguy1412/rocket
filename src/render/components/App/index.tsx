import { createRouter, useRouter } from '@/lib/Router';
import style from './App.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';
import { Login } from '@/render/views/Login';

namespace App {
    export type Props = {};
}

export const AppRouter = createRouter({
    'login': Login,
}, 'login');

export const App = memo(({}: App.Props) => {
    const { View } = useRouter(AppRouter);

    return <View></View>;
});
