const fs = require('fs').promises;
const path = require('path');

// Constants
const COMPONENT_NAME_TMPL = '$NAME$';
const DEFAULT_ROOT = process.cwd();
const TEST_ROOT = path.join(__dirname, './.tmp');
const COMPONENT_TEMPLATE = path.resolve(process.cwd(), './.templates/component/component.tsx.tmpl');
const STORIES_TEMPLATE = path.resolve(process.cwd(), './.templates/component/component.stories.tsx.tmpl');
const STYLES_TEMPLATE = path.resolve(process.cwd(), './.templates/component/component.styles.ts.tmpl');
const TARGET_MAP = {
  '--web': path.resolve(DEFAULT_ROOT, './src/web/components'),
  '--common': path.resolve(DEFAULT_ROOT, './src/common/components'),
  '--game': path.resolve(DEFAULT_ROOT, './src/game/components'),
}
const TEST_MAP = {
  '--web': path.resolve(TEST_ROOT, './web/components'),
  '--common': path.resolve(TEST_ROOT, './common/components'),
  '--game': path.resolve(TEST_ROOT, './game/components'),
}

// Arg handling
const [componentName, ...args] = process.argv.slice(2);

// Make sure we have been passed valid args.
if (!componentName || componentName.startsWith('--') || !componentName.match(/^[A-Z]/)) {
  console.log(
    'Noice component generation boilerplate script. Usage:',
    '\n\nyarn generate-component <ComponentName> --[web|common|game] [--test]',
    '\n\nRemember:\n',
    '- Make sure the component name is UpperCase.\n',
    '- If it will be used in both web and game, put it in common.'
  );
  process.exit(1);
}

const noCleanMode = args.findIndex((arg) => arg === '--no-clean') > 0;
const isTestMode = args.findIndex((arg) => arg === '--test') > 0;
if (isTestMode) {
  console.log('Running in test mode. Target paths will be augmented.');
  if (noCleanMode) console.log('No-clean mode active, will not clean up test artifacts.');
}

// Determine target
const target = args.find((arg) => Object.keys(TARGET_MAP).includes(arg));
if (!target) {
  console.log(
    'No target passed! Please specify a target. Possible Options:',
    `\n\t${Object.keys(TARGET_MAP).join(', ')}\n`
  );
  process.exit(1);
}

const outputRoot = isTestMode ? TEST_MAP[target] : TARGET_MAP[target];
console.log(`Generating new component to target:\n${target.slice(2).toUpperCase()}\t\t${outputRoot}\n`);

// Helpers
function normalizePath(somePath) {
  return path.relative(DEFAULT_ROOT, somePath);
}

async function createDir(dir) {
  try {
    console.log('Creating directory:', normalizePath(dir));
    await fs.mkdir(dir, { recursive: true });
    return true;
  } catch (e) {
    console.log(`ERROR creating directory ${normalizePath(dir)}:`, e);
    process.exit(1);
  }
}

async function writeFile(filePath, fileContents) {
  try {
    console.log(`WRITING \t ${normalizePath(filePath)}`);
    await fs.writeFile(filePath, fileContents, { encoding: 'utf-8' });
    return true;
  } catch (e) {
    console.log(`ERROR writing file ${normalizePath(filePath)}:`, e);
    return false;
  }
}

// Steps
async function loadComponentTemplates() {
  try {
    console.log('Loading component templates.');
    return Promise.all([
      await fs.readFile(COMPONENT_TEMPLATE, { encoding: 'utf-8' }),
      await fs.readFile(STORIES_TEMPLATE, { encoding: 'utf-8' }),
      await fs.readFile(STYLES_TEMPLATE, { encoding: 'utf-8' }),
    ]);
  } catch (e) {
    console.error('ERROR loading component templates!', e);
    process.exit(1);
  }
}

// Main script
async function main(name, outputDir, testMode = false, noClean = false) {
  try {
    console.log('\nStarting.');
    // (test mode only) create temp directory
    if (testMode) {
      await createDir(outputDir);
    }
    
    const componentDir = path.join(outputDir, `/${name}`);
    const [componentTmpl, storiesTmpl, stylesTmpl] = await loadComponentTemplates();

    // Inject component name into templates
    console.log(`Injecting component name '${name}' into templates.`);
    const injectedComponent = componentTmpl.replaceAll(COMPONENT_NAME_TMPL, name);
    const injectedStory = storiesTmpl.replaceAll(COMPONENT_NAME_TMPL, name);
    const injectedStyles = stylesTmpl.replaceAll(COMPONENT_NAME_TMPL, name);

    // Create directory for templates
    await createDir(componentDir);

    // Copy files over
    const componentFile = path.join(componentDir, `/${name}.tsx`);
    const storyFile = path.join(componentDir, `/${name}.stories.tsx`);
    const styleFile = path.join(componentDir, `/${name}.styles.ts`);

    const [componentResult, storyResult, stylesResult] = await Promise.all([
      await writeFile(componentFile, injectedComponent),
      await writeFile(storyFile, injectedStory),
      await writeFile(styleFile, injectedStyles)
    ]);
    
    console.log(componentResult ? 'SUCCESS' : 'FAIL', '\t', normalizePath(componentFile));
    console.log(storyResult ? 'SUCCESS' : 'FAIL', '\t', normalizePath(storyFile));
    console.log(stylesResult ? 'SUCCESS' : 'FAIL', '\t', normalizePath(styleFile));

    console.log('Completed.');
    if (testMode && !noClean) {
      console.log('Cleaning.');
      await fs.rm(TEST_ROOT, { recursive: true });
    }
    process.exit(0);
  } catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
  }
}

main(componentName, outputRoot, isTestMode, noCleanMode);
