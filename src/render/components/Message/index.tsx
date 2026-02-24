import style from './Message.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { APIMessageArray } from '@/schemas/responses';
export namespace Message {
    export type Props = {
        message: APIMessageArray[number];
    };
}

const _Message = ({ message }: Message.Props) => {
    return <li>
        {message.author?.username}#{message.author?.discriminator}: {message.content}
    </li>;
};

export const Message = memo(_Message);
