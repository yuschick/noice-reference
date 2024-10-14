import esbuild from 'esbuild';
import {
  svgUrlPlugin,
  cssVariablePostcssPlugin,
  webworkerPlugin,
} from '@noice-com/esbuild-plugins';
import svgr from 'esbuild-plugin-svgr';
import esbuildYamlPlugin from 'esbuild-plugin-yaml';
import postcssFunctionsPlugin from 'postcss-functions';
import postcssFunctions from '@noice-com/postcss/functions';
import path from 'path';

const getDefaultOptions = (isWatch) => ({
  // this needs to be true for the htmlPlugin
  metafile: true,
  outdir: 'dist',
  bundle: true,
  minify: !isWatch,
  sourcemap: true,
  target: ['chrome58'],
  platform: 'browser',
  loader: {
    '.otf': 'file',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.eot': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.webm': 'file',
    '.mp3': 'file',
    '.wav': 'file',
    '.glsl': 'text',
    '.ico': 'file',
    '.fbx': 'file',
    '.glb': 'file',
    '.exr': 'file',
    '.hdr': 'file',
    '.mp4': 'file',
    '.webp': 'file',
  },
  // Plugins
  plugins: [
    // Postcss for variables css files
    cssVariablePostcssPlugin(
      postcssFunctionsPlugin({ functions: postcssFunctions })
    ),
    // .svg?url -files are resolved as paths (not with svgr)
    svgUrlPlugin,
    // svgr plugin makes it possible to use svg's as react components
    svgr(),
    // yaml plugin to make yaml readable
    esbuildYamlPlugin.yamlPlugin(),
  ],
});

const build = (options, { isWatch = false, name = 'ui' }) => {
  const defaultOptions = getDefaultOptions(isWatch);

  const plugins = defaultOptions.plugins.concat(options?.plugins || []);
  const loader = Object.assign({}, defaultOptions.loader, options.loader);

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  plugins.push(
    webworkerPlugin((options) => {
      const { plugins: _, ...optsWithoutPlugins } = mergedOptions;

      return esbuild.build({
        ...optsWithoutPlugins,
        ...options,
        bundle: true,
      });
    })
  );

  performance.mark(`${name}-start`);

  return esbuild
    .build({
      ...mergedOptions,
      plugins,
      loader,
      ...(isWatch && {
        watch: {
          onRebuild(err, result) {
            if (err) console.error(`${name} Build error:`, err);
            else
              console.log(
                `${name} incremental rebuild complete (${result.warnings.length} warnings)`
              );
          },
        },
      }),
    })
    .then((result) => {
      performance.mark(`${name}-end`);
      const measurements = performance.measure(
        `${name}-time`,
        `${name}-start`,
        `${name}-end`
      );
      if (result.errors.length > 0) {
        console.error(
          `There were errors in ${name} during bundling:`,
          result.errors
        );
      } else {
        console.log(
          isWatch
            ? `Found 0 errors. Watching for ${name} file changes.`
            : `${name} build  complete. (completed after ${measurements.duration.toFixed(
                2
              )}ms)`
        );
      }
      return result;
    });
};

export default { build };
