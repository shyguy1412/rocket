import style from './FormController.module.css';

import { h, TargetedEvent, TargetedSubmitEvent } from 'preact';
import { memo, useCallback } from 'preact/compat';

import { Lumber } from '@/lib/log/Lumber';
import { ApiCall, ApiResult } from '@/api';
import { createModal, useModal } from '@/lib/components/Modal';
import { Instance, InstanceStore, useInstances } from '@/render/store/Instance';

export namespace FormController {
    export type Form = (props: FormProps) => h.JSX.Element;

    export type Props<B, R> = {
        apiCall: ApiCall<[], undefined, B, R>;
        Form: Form;
        onSuccess: (instance: string, response: R) => void;
    };

    export type FormProps = {};
}

async function parseInstanceWellKnown(instance: any): Promise<Instance> {
    if (!instance) {
        throw new Error('not an instance');
    }
    if (typeof instance.api != 'string') {
        return instance;
    }

    const data = await fetch(instance.api + '/policies/instance/domains')
        .then((r) => r.json());

    const apiBaseURL = new URL(data.api);
    apiBaseURL.pathname = '';

    const instanceFromV1 = {
        api: {
            baseUrl: apiBaseURL.toString().replace(/\/$/, ''),
            apiVersions: {
                default: data.defaultApiVersion,
                active: [data.defaultApiVersion],
            },
        },
        cdn: {
            baseUrl: data.cdn,
        },
        gateway: {
            baseUrl: data.gateway,
            encoding: [],
            compression: [],
        },
        admin: {
            baseUrl: data.admin,
        },
    };

    return instanceFromV1;
}

function getInstance(url: string) {
    return fetch(`${url}.well-known/spacebar/client`)
        .then((r) => r.json() as Promise<any>)
        .catch(() => null)
        .then(parseInstanceWellKnown);
}

const _AddInstanceModal = createModal(({ abort }) => {
    const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = e.currentTarget.querySelector('input')!.value.replace(/\/?$/, '/');
        getInstance(url)
            .then((instance) => {
                InstanceStore.trigger.addInstance({ instance });
            })
            .then(abort);
    };

    return <form onSubmit={onSubmit}>
        <input type='text' name='instance-url' />
        <input type='submit' hidden />
    </form>;
});

const _FormController = <B, R>(props: FormController.Props<B, R>) => {
    Lumber.log(Lumber.RENDER, 'FORM CONTROLLER RENDER');

    const { apiCall, Form, onSuccess } = props;
    const AddInstanceModal = useModal(_AddInstanceModal);

    const instances = useInstances();

    const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form).entries().toArray();
        const requestBody = Object.fromEntries(
            formData,
        ) as any;

        const instance = requestBody['form_controller_instance'] as string;
        delete requestBody['form_controller_instance'];

        //@ts-ignore ts fails to properly resolve the variadic
        apiCall(instance, requestBody as B)
            .then((result) => validateForm(form, result))
            .then((result) => result.map((response) => onSuccess(instance, response)));
    };

    const Instances = useCallback(
        () =>
            instances.map((instance, i) =>
                <option key={i} value={instance.api.baseUrl}>
                    {instance.api.baseUrl}
                </option>
            ),
        [instances],
    );

    const onInstanceChange = useCallback((e: TargetedEvent<HTMLSelectElement>) => {
        if (e.currentTarget.value != 'add_new') {
            return;
        }
        e.currentTarget.value = '';
        AddInstanceModal.open({});
    }, []);

    return <form class={style.form} onSubmit={onSubmit}>
        <label for='form_controller_instance'>Instance</label>
        <select
            name='form_controller_instance'
            defaultValue={instances[0]?.api.baseUrl ?? ''}
            onChange={onInstanceChange}
        >
            <Instances></Instances>
            <option value={'add_new'}>
                Add Instance
            </option>
        </select>

        <Form></Form>
    </form>;
};

export const FormController = memo(_FormController);

function validateForm<R>(
    form: HTMLFormElement,
    result: ApiResult<R>,
): ApiResult<R> {
    if (result.isOk()) {
        return result;
    }

    for (const { property, message, code } of result.error.errors) {
        if (!property) {
            continue;
        }

        //! handle validity for INVALID_LOGIN
        //! validity for both login and password need to be reset if
        //! either is changed
        // //if the login is wrong both
        // if (property != 'password' && code == "INVALID_LOGIN") {
        //     continue;
        // }

        const field = form.querySelector(
            `[name=${property}]`,
        );

        if (!field || !(field instanceof HTMLInputElement)) {
            continue;
        }

        field.setCustomValidity(message);
        field.addEventListener('change', () => field.setCustomValidity(''), {
            once: true,
        });
        break;
    }

    form.reportValidity();
    return result;
}
