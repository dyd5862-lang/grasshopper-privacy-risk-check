import fs from 'node:fs';
import ts from 'typescript';

export async function loadTypeScript(relativePath, base = import.meta.url) {
  const url = new URL(relativePath, base);
  const source = fs.readFileSync(url, 'utf8');
  const output = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  let code = output;
  for (const match of output.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
    const path = /\.[cm]?[jt]sx?$/.test(match[1]) ? match[1] : `${match[1]}.ts`;
    const child = await moduleUrl(new URL(path,url));
    code=code.replace(match[0],`from "${child}"`);
  }
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
async function moduleUrl(url) {
  let code=ts.transpileModule(fs.readFileSync(url,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  for (const match of [...code.matchAll(/from\s+["'](\.[^"']+)["']/g)]) {
    const path=/\.[cm]?[jt]sx?$/.test(match[1])?match[1]:`${match[1]}.ts`;
    code=code.replace(match[0],`from "${await moduleUrl(new URL(path,url))}"`);
  }
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
}
