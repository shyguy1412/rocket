import style from './Message.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { APIMessageArray } from '@/schemas/responses';
import { Avatar } from '@/render/components/Avatar';
import Markdown from 'react-markdown';
import highlight from 'highlight.js';
export namespace Message {
    export type Props = {
        message: APIMessageArray[number];
    };
}

const _Message = ({ message }: Message.Props) => {
    return <li class={style.message}>
        <Avatar user={message.author!} />
        <div>
            {message.author?.username}
            <br />
            <Markdown
                components={{
                    code(props) {
                        return <code
                            ref={(ref) => void (ref && highlight.highlightElement(ref))}
                            {...props}
                        />;
                    },
                }}
            >
                {message.content}
            </Markdown>
        </div>
    </li>;
};

export const Message = memo(_Message);
