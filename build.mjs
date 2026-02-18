import { context } from 'esbuild';
import { readFile } from 'fs/promises';
import p from 'path';

const WATCH = process.argv.includes('--watch');
const HOST = process.argv[(process.argv.indexOf('--host') + 1) || -1] ??
    '0.0.0.0';
const PORT = +(process.argv[(process.argv.indexOf('--port') + 1) || -1] ?? 8000);

const createMainContext = async () =>
    await context({
        entryPoints: [
            'src/main/main.ts',
            'src/main/preload.ts',
        ],
        outdir: './build',
        outbase: './src/main',
        loader: {
            '.node': 'copy',
        },
        bundle: true,
        packages: 'external',
        format: 'cjs',
        platform: 'node',
        logLevel: 'info',
    });

/** @type import("esbuild").Plugin */
const reloadPlugin = {
    name: 'HTMLPlugin',
    setup(pluginBuild) {
        pluginBuild.onLoad({ filter: /.*\.html$/ }, async (opts) => {
            const file = await readFile(opts.path, { encoding: 'utf8' });
            return {
                contents: file.replace(
                    '</head>',
                    "    <script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>\n</head>",
                ),
                loader: 'copy',
            };
        });
    },
};

/** @type import("esbuild").Plugin */
const MetaImports = {
    name: 'MetaImports',
    setup(pluginBuild) {
        pluginBuild.onResolve({ filter: /meta:.*/ }, (opts) => {
            const namespace = opts.path.replace(/(meta:[A-Za-z_-]*).*/, '$1');

            return {
                path: opts.importer,
                pluginData: opts,
                namespace,
            };
        });

        pluginBuild.onLoad({ filter: /.*/, namespace: 'meta:api' }, (opts) => {
            const base = p.resolve(opts.pluginData.path.match(/(?<=\().*?(?=\))/)[0]);
            const path = opts.path.replace(base, '').replace(/\.(t|j)sx?/, '');

            return {
                contents: path,
                loader: 'text',
            };
        });
    },
};

const createRenderContext = async () =>
    await context({
        entryPoints: [
            'src/render/index.tsx',
            'src/render/index.html',
        ],
        loader: { '.html': 'copy', '.woff2': 'copy' },
        plugins: [
            ...(WATCH ? [reloadPlugin] : []),
            MetaImports,
        ],
        outbase: './src/render',
        outdir: './build',
        bundle: true,
        format: 'esm',
        platform: 'browser',
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
            'react-reconciler': 'preact-reconciler',
        },
        // minify: !WATCH,
        logLevel: 'info',
        sourcemap: 'inline',
    });

const renderCtx = await createRenderContext();
const mainCtx = await createMainContext();

if (WATCH) {
    renderCtx.serve({ host: HOST, port: PORT });
    renderCtx.watch();
    mainCtx.watch();
} else {
    await renderCtx.rebuild();
    renderCtx.dispose();

    await mainCtx.rebuild();
    mainCtx.dispose();
}
