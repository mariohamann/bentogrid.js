// Import the required 'jsdoc-to-markdown' module
const jsdoc2md = require('jsdoc-to-markdown');
const Markdoc = require('@markdoc/markdoc')
const { NodeHtmlMarkdown } = require('node-html-markdown');
const yaml = require('js-yaml');
const fs = require('fs');

// Generate the Markdown documentation from the input file
jsdoc2md.render({ files: '../core/BentoGrid.js' }).then(jsDocMd => {
  const readmeMdoc = fs.readFileSync('./src/data/readme.mdoc', 'utf8');

  const ast = Markdoc.parse(readmeMdoc + jsDocMd);

  const frontmatter = ast.attributes.frontmatter
    ? yaml.load(ast.attributes.frontmatter)
    : {};

  const packageJson = JSON.parse(fs.readFileSync('../core/package.json', 'utf8'));

  const config = {
    variables: {
      frontmatter,
      packageJson
    }
  };

  const content = Markdoc.transform(ast, config);

  // Create HTML and fix all broken stuff
  const html = Markdoc.renderers.html(content)
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('<code>', '`').replaceAll('</code>', '`')
    .replaceAll("\"'", '\'').replaceAll("'\"", '\'')
    ;

  // Unfortunately, Markdoc isn't able to render... Markdown.
  const markdown = NodeHtmlMarkdown.translate(html)
    .replaceAll('\\`', '`')

  // Save to '../core/package.json'
  fs.writeFileSync('../core/README.md', markdown);
}).catch(error => {
  console.error('An error occurred while generating the documentation:', error);
});
