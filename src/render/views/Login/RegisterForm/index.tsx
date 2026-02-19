import style from './RegisterForm.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';
import { useRouter } from '@/lib/Router';
import { FormController } from '@/render/views/Login/FormController';
import { Lumber } from '@/lib/log/Lumber';

export const _RegisterForm = (props: FormController.FormProps) => {
    const { router, onSubmit } = props;
    const { setRoute } = useRouter(router);

    Lumber.log(Lumber.RENDER, 'REGISTER FORM RENDER');

    return <form class={style.form} onSubmit={onSubmit} action=''>
        <label for='email'>Email</label>
        <input
            type='email'
            required
            name='email'
            defaultValue={'test@mail.com'}
        />

        <label for='username'>Username</label>
        <input
            type='text'
            required
            name='username'
            defaultValue={'shy'}
        />

        <label for='password'>Password</label>
        <input
            type='password'
            name='password'
            required
            defaultValue='password'
        />

        <label for='date_of_birth'>Birthday</label>
        <input
            type='date'
            required
            name='date_of_birth'
            defaultValue={'2000-08-25'}
        />

        <label for='consent'>Birthday</label>
        <input
            type='checkbox'
            required
            name='consent'
            value='true'
        />

        <input type='submit' value={'Register'} />
        <input
            type='reset'
            value={'Login'}
            onClick={() => setRoute('login')}
        />
    </form>;
};

export const RegisterForm = memo(_RegisterForm);
