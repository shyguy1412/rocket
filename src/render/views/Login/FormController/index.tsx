import { h, TargetedSubmitEvent } from 'preact';
import { memo } from 'preact/compat';
import { ApiCall, ApiResult } from '@/api';
import { Lumber } from '@/lib/log/Lumber';

export namespace FormController {
    export type Form = (props: FormProps) => h.JSX.Element;

    export type Props<B, R> = {
        setRoute: (route: string) => void;
        apiCall: ApiCall<B, R>;
        Form: Form;
        onSuccess: (response: R) => void;
    };

    export type FormProps = {
        setRoute: (route: string) => void;
        onSubmit: (e: TargetedSubmitEvent<HTMLFormElement>) => void;
    };
}

const _FormController = <B, R>(props: FormController.Props<B, R>) => {
    const { apiCall, Form, setRoute, onSuccess } = props;
    Lumber.log(Lumber.RENDER, 'FORM CONTROLLER RENDER');

    const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('SUBMIT');

        const form = e.currentTarget;
        const formData = new FormData(form).entries().toArray();
        const requestBody = Object.fromEntries(
            formData,
        ) as unknown as B;

        apiCall(requestBody)
            .then((result) => validateForm(form, result))
            .then((result) => result.map(onSuccess));
    };

    return (
        <Form setRoute={setRoute} onSubmit={onSubmit}>
        </Form>
    );
};

export const FormController = memo(_FormController);

function validateForm<R>(
    form: HTMLFormElement,
    result: ApiResult<R>,
): ApiResult<R> {
    if (result.isOk()) {
        return result;
    }

    for (const { property, message } of result.error.errors) {
        if (!property) {
            continue;
        }

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
