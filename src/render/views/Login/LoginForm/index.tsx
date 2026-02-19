import { useRouter } from '@/lib/Router';
import style from './LoginForm.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';
import { FormController } from '@/render/views/Login/FormController';
import { Lumber } from '@/lib/log/Lumber';

const LoginFormComponent = (props: FormController.FormProps) => {
    const { router, onSubmit } = props;
    const { setRoute } = useRouter(router);

    Lumber.log(Lumber.RENDER, 'LOGIN FORM RENDER');

    return <form
        class={style.form}
        onSubmit={onSubmit}
    >
        <label for='login'>Email</label>
        <input
            type='email'
            name='login'
            defaultValue={'test@mail.com'}
            required
        />

        <label for='password'>Password</label>
        <input
            type='password'
            name='password'
            defaultValue={'password'}
            required
        />

        <input type='submit' value={'Login'} />
        <input
            type='reset'
            value={'Register'}
            onClick={() => setRoute('register')}
        />
    </form>;
};

export const LoginForm = memo(LoginFormComponent);
