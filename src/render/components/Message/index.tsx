import style from './Message.module.css';

import { h, HTMLAttributes } from 'preact';
import { memo, useMemo } from 'preact/compat';

import { APIMessageArray } from '@/schemas/responses';
import { Avatar } from '@/render/components/Avatar';
import Markdown from 'react-markdown';
import highlight from 'highlight.js';
import { useInstance } from '@/render/store/Instance';
export namespace Message {
    export type Props = {
        message: APIMessageArray[number];
    };
}

const SyntaxHighlightedCode = (props: HTMLAttributes<HTMLElement>) => {
    return <code
        ref={(ref) => void (ref && highlight.highlightElement(ref))}
        {...props}
    />;
};

const InNewWindowAnchor = (props: HTMLAttributes<HTMLAnchorElement>) => {
    return <a
        target='_blank'
        {...props}
    >
    </a>;
};

const _Message = ({ message }: Message.Props) => {
    const cdn = useMemo(() => useInstance().cdn.baseUrl, [message]);

    const Images = message.attachments?.filter((att) =>
        att.content_type?.includes('image')
    ).map((att) => {
        return <img loading='lazy' src={att.proxy_url} />;
    });

    return <li class={style.message}>
        <Avatar user={message.author!} />
        <div>
            {message.author?.username}
            <div class={style.content}>
                <Markdown
                    components={{
                        code: SyntaxHighlightedCode,
                        a: InNewWindowAnchor,
                    }}
                >
                    {message.content
                        ?.replaceAll(
                            /(?<!(?:\[.*?\]\()|<)(https?:\/\/[^\s]*)(?!>)/g,
                            (a, b) => `[${b}](${b})`,
                        )
                        .replaceAll(
                            /<.?:([A-Za-z0-9_-]*?):([A-Za-z0-9_-]*?)>/g,
                            (a, b, c) => `![${b}](${cdn}/emojis/${c})`,
                        )}
                </Markdown>
            </div>
            {Images}
        </div>
    </li>;
};

export const Message = memo(_Message);
