import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/manifest.json'),'utf8'));
const output=path.join(root,'dist',`replay-shield-v${manifest.version}.zip`);
fs.mkdirSync(path.dirname(output),{recursive:true});
// Git archives only the extension directory from the current commit. No publishing.
execFileSync('git',['archive','--format=zip',`--output=${output}`,'HEAD','extension/'],{cwd:root,stdio:'inherit'});
console.log(`Created local package: ${output}`);
