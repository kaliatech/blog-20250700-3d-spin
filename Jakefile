const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

desc('Copy all files from babylon-prebuilt-viewer to dist-gh-pages/babylon-prebuilt-viewer');
task('copy-dist-gh-pages', async function () {
  const srcViewer = path.join(__dirname, 'babylon-prebuilt-viewer');
  const destViewer = path.join(__dirname, 'dist-gh-pages', 'babylon-prebuilt-viewer');
  await fse.copy(srcViewer, destViewer);
  console.log('Copied babylon-prebuilt-viewer to dist-gh-pages/babylon-prebuilt-viewer');

  const srcCustom = path.join(__dirname, 'babylon-custom-viewer/dist');
  const destCustom = path.join(__dirname, 'dist-gh-pages', 'babylon-custom-viewer');
  await fse.copy(srcCustom, destCustom);
  console.log('Copied babylon-custom-viewer to dist-gh-pages/babylon-custom-viewer');

  const srcRoot = path.join(__dirname, 'dist-root');
  const destRoot = path.join(__dirname, 'dist-gh-pages');
  if (fs.existsSync(srcRoot)) {
    await fse.copy(srcRoot, destRoot);
    console.log('Copied dist-root to dist-gh-pages');
  }
  complete();
});
