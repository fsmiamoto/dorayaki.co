import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const extensions = [".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"];

function resolveFile(base) {
  if (existsSync(base) && extensions.some((extension) => base.endsWith(extension))) {
    return base;
  }

  for (const extension of extensions) {
    if (existsSync(base + extension)) {
      return base + extension;
    }
  }

  for (const extension of [".ts", ".tsx", ".js"]) {
    const index = path.join(base, `index${extension}`);
    if (existsSync(index)) {
      return index;
    }
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const file = resolveFile(path.join(projectRoot, specifier.slice(2)));
    if (!file) {
      return nextResolve(specifier, context);
    }
    return { url: pathToFileURL(file).href, shortCircuit: true };
  }

  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (!specifier.startsWith(".")) {
      throw error;
    }

    const parentPath = context.parentURL?.startsWith("file:")
      ? fileURLToPath(context.parentURL)
      : projectRoot;
    const file = resolveFile(path.resolve(path.dirname(parentPath), specifier));
    if (!file) {
      throw error;
    }
    return { url: pathToFileURL(file).href, shortCircuit: true };
  }
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:") && (url.endsWith(".ts") || url.endsWith(".tsx"))) {
    const source = await readFile(fileURLToPath(url), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
      fileName: fileURLToPath(url),
    });
    return { format: "module", shortCircuit: true, source: outputText };
  }

  return nextLoad(url, context);
}
