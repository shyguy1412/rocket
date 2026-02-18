import { App } from '@/render/components/App';
import './index.css';
import 'normalize.css';
import { h, render } from 'preact';

type Props = {};

function Index({}: Props) {
    return <App></App>;
}

render(<Index></Index>, document.body);
