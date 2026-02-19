import { createRouter, useRouter, useView } from '@/lib/Router';
import style from './App.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';
import { Login } from '@/render/views/Login';
import { Home } from '@/render/views/Home';

namespace App {
    export type Props = {};
}

export const AppRouter = createRouter({
    login: Login,
    home: Home,
}, 'login');

export const App = memo(({}: App.Props) => {
    const View = useView(AppRouter);

    return <View></View>;
});
