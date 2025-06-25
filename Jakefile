const fs = require('fs');
const path = require('path');

desc('Copy all files from babylon-prebuilt-viewer to dist/babylon-prebuilt-viewer');
task('dist', function () {
  const distDir = path.join(__dirname, 'dist', 'babylon-prebuilt-viewer');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const srcDir = path.join(__dirname, 'babylon-prebuilt-viewer');
  fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const distFile = path.join(distDir, file);
    fs.copyFileSync(srcFile, distFile);
    console.log(`Copied ${file} to dist/babylon-prebuilt-viewer`);
  });
});
