const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'extension/manifest.json')));
assert.equal(manifest.author,'Xun');
for(const f of [...manifest.content_scripts[0].js,...manifest.content_scripts[0].css,manifest.action.default_popup,...Object.values(manifest.icons)])assert.ok(fs.existsSync(path.join(root,'extension',f)),f);
for(const file of ['README.md','demo/index.html','extension/popup.html']){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 const refs=[...text.matchAll(/(?:src|href)="([^"]+)"/g),...text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)];
 for(const m of refs){const ref=m[1];if(/^(?:https?:|#|data:|mailto:)/.test(ref))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root,file)),ref.split('#')[0])),`${file}: ${ref}`);}
}
console.log('PASS manifest, author, icons, README and HTML asset references');
