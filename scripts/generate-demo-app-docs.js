/*
   This script generates the API documentation pages in demo app
   It does this in a bit roundabout way:
    1. It uses typedoc to go over library's public API filed and to generate HTML files
       based on customised typedoc theme.
    2. It goes over the files generated by typedoc and converts each one into an Angular
       component that displays the HTML in its template, making any tweaks as necessary.
    3. It generates an Angular module with the generated components and
       sets up router config so that original HTML URLs will map to the generated components.
 */

const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const rimraf = require('rimraf');
const typedoc = require('typedoc');

const utils = require('./utils.js');

/** Run typedoc over library public API files to generate HTML files from customised typedoc theme
 * The resulting files are not really useful on their own; they will be used later to generate demo app code
 */
function generateTypedocDocs(typedocDocsDir) {
  const publicApiConfigFile = path.resolve(__dirname, '../src/ngx-slider/lib/public_api.json');
  const publicApiConfig = JSON.parse(fs.readFileSync(publicApiConfigFile, { encoding: 'utf8' }));

  const files = publicApiConfig.exports
    .map(exportDef => path.resolve(__dirname, `../src/ngx-slider/lib/${exportDef.file}.ts`));

  const themeDir = path.resolve(__dirname, '../typedoc-theme');

  // HACK: When Typedoc finds a README.md file, it uses it to generate content for the index page of documentation
  // This is not very helpful, as it repeats the same stuff that's already shown on Github and NPM
  // So instead, replace the README.md with our own file
  const apiDocsReadmeFile = path.resolve(__dirname, '../typedoc-theme/README.md');
  utils.copyReadmeMd(apiDocsReadmeFile);

  const app = new typedoc.Application({
    module: 'commonjs',
    target: 'es6',
    includeDeclarations: false,
    experimentalDecorators: true,
    excludeExternals: true,
    theme: themeDir
  });

  app.generateDocs(files, typedocDocsDir);

  // HACK: restore the README.md to original
  const mainReadmeFile = path.resolve(__dirname, '../README.md');
  utils.copyReadmeMd(mainReadmeFile);
}

/** Convert typedoc HTML file into Angular component for use in demo app */
function generateComponent(typedocHtmlFile, relativeTypedocHtmlFile, demoAppDocsModuleDir) {
  const directory = path.dirname(relativeTypedocHtmlFile);
  mkdirp.sync(path.join(demoAppDocsModuleDir, directory));

  const fileName = path.basename(relativeTypedocHtmlFile);
  const componentHtmlFileName = fileName.replace(/\.html$/, '.component.html');

  const componentHtmlFile = path.join(demoAppDocsModuleDir, directory, componentHtmlFileName);
  const typedocHtmlFileContent = fs.readFileSync(typedocHtmlFile, { encoding: 'utf8' });
  const escapedHtmlFileContent = fixRouterFragments(fixReadmeMdLinks(escapeHtmlForAngular(typedocHtmlFileContent)));

  fs.writeFileSync(componentHtmlFile, escapedHtmlFileContent, { encoding: 'utf8' });

  const componentFileName = fileName.replace(/\.html$/, '.component');
  const componentTsFileName = componentFileName + '.ts';
  const componentTsFile = path.join(demoAppDocsModuleDir, directory, componentTsFileName);

  const componentName = generateComponentName(fileName);
  const componentTsFileContent = `import { Component } from '@angular/core';

@Component({
  templateUrl: './${componentHtmlFileName}'
})
export class ${componentName} { }
`;
  fs.writeFileSync(componentTsFile, componentTsFileContent, { encoding: 'utf8' });

  // Return metadata for generating module file
  return {
    name: componentName,
    importPath: `${directory}/${componentFileName}`, // unlike system paths, this is a typescript import path, so always use /
    route: relativeTypedocHtmlFile // route is based on original file name
  };
}

/** We need to escape `{` characters in HTML or otherwise Angular throws a fit */
function escapeHtmlForAngular(rawHtml) {
  return rawHtml.replace(/\{/g, "{{ '{' }}");
}

/** Links in README.md need special treatment */
function fixReadmeMdLinks(html) {
  return html.replace(/href=\"routerLink:\/\/([^"]+)"/g, 'routerLink="$1"');
}

/** We want all <a href="..."> links to work as Angular router links
 * Most of that is already taken care of by custom typedoc theme where routerLink="..." is used instead of href="..."
 * However, annoyingly, fragment links (/target.html#fragment) need special treatment
 *  `routerLink="/target.html#fragment"` needs to become `routerLink="/target.html" fragment="fragment"` */
function fixRouterFragments(html) {
  return html.replace(/routerLink="([^"]+)#([^"]+)"/g, 'routerLink="$1" fragment="$2"');
}

/** Generate component name from HTML file name
 * It preserves all except for _ and . characters that get added by typedoc
 * The generated named is still weird, but it doesn't matter */
function generateComponentName(fileName) {
  const bareName = fileName.replace(/\.html$/, '').replace(/[._]/g, '');
  return bareName.charAt(0).toUpperCase() + bareName.substr(1) + 'Component';
}

/** Generate module file based on metadata from generated components */
function generateModuleFile(componentsMetadata, demoAppDocsModuleDir) {
  const imports = componentsMetadata
    .map(componentMetadata => `import { ${componentMetadata.name} } from './${componentMetadata.importPath}';`)
    .join('\n');

  const components = componentsMetadata
    .map(componentMetadata => `    ${componentMetadata.name},`)
    .join('\n');

  const routes = componentsMetadata
    .map(componentMetadata => `    { path: 'docs/${componentMetadata.route}', component: ${componentMetadata.name} },`)
    .join('\n');

  const moduleTsFileContents = `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

${imports}

const routes: Routes = [
    { path: 'docs', component: IndexComponent }, // always start with index
${routes}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [
${components}
  ],
  exports: [
${components}
  ]
})
export class DocsModule { }
`;

  const moduleTsFile = path.join(demoAppDocsModuleDir, 'docs.module.ts');
  fs.writeFileSync(moduleTsFile, moduleTsFileContents, { encoding: 'utf8' });
}


const typedocDocsDir = path.resolve(__dirname, '../docs');
rimraf.sync(typedocDocsDir);
mkdirp.sync(typedocDocsDir);
generateTypedocDocs(typedocDocsDir);

const demoAppDocsModuleDir = path.resolve(__dirname, '../src/demo-app/app/docs');
rimraf.sync(demoAppDocsModuleDir);
mkdirp.sync(demoAppDocsModuleDir);

const typedocHtmlFiles = utils.readdirRecursivelySync(typedocDocsDir)
  .filter((file) => file.endsWith('.html'));

const componentsMetadata = [];
for (let typedocHtmlFile of typedocHtmlFiles) {
  const relativeTypedocHtmlFile = path.relative(typedocDocsDir, typedocHtmlFile);
  const componentMetadata = generateComponent(typedocHtmlFile, relativeTypedocHtmlFile, demoAppDocsModuleDir);
  componentsMetadata.push(componentMetadata);
}

generateModuleFile(componentsMetadata, demoAppDocsModuleDir);
