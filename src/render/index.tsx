import './index.css';
import 'normalize.css';

import { h, render } from 'preact';

import { App } from '@/render/components/App';
import { Lumber } from '@/lib/log/Lumber';

Lumber.blockChannel(Lumber.RENDER);
render(<App />, document.body);
