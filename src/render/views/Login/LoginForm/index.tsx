import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';
import { FormController } from '@/render/views/Login/FormController';
import { Lumber } from '@/lib/log/Lumber';
import { LoginRouter } from '@/render/views/Login';

const _LoginForm = (props: FormController.FormProps) => {
    Lumber.log(Lumber.RENDER, 'LOGIN FORM RENDER');

    return <>
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
            onClick={() => LoginRouter.trigger.setRoute({ route: 'register' })}
        />
    </>;
};

export const LoginForm = memo(_LoginForm);
