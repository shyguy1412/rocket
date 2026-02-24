import style from './App.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { Login } from '@/render/views/Login';
import { Home } from '@/render/views/Home';
import { Lumber } from '@/lib/log/Lumber';
import { createRouter, useView } from '@/lib/Router';

namespace App {
    export type Props = {};
}

export const AppRouter = createRouter({
    login: Login,
    home: Home,
}, 'home');

export const App = memo(({}: App.Props) => {
    const View = useView(AppRouter);

    Lumber.log(Lumber.RENDER, 'APP RENDER');

    return <View></View>;
});
