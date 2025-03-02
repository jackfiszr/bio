import { join } from "@std/path";

const moduleDir = join(Deno.cwd(), Deno.args[0]);

const readmePath = join(moduleDir, "README.md");
const examplesPath = join(moduleDir, "examples.ts");

const readmeContent = await Deno.readTextFile(readmePath);
const exampleRegex = /(?:^|\n)([\s\S]*?)\n```ts([\s\S]*?)```/g;

let match;
let examplesContent = "";

while ((match = exampleRegex.exec(readmeContent)) !== null) {
  const description = match[1].trim();
  const codeBlock = match[2].trim();
  if (description) {
    examplesContent += `console.log(\`\n${
      description.replace(/`/g, "\\`")
    }\`);\n`;
  }
  examplesContent += `${codeBlock}\n\n`;
}

await Deno.writeTextFile(examplesPath, examplesContent.trim());
console.log(`Examples extracted to ${examplesPath}`);

const command = new Deno.Command("deno", {
  args: ["fmt", examplesPath],
});

const { code, stderr } = await command.output();
if (code === 0) {
  console.log(`Formatted ${examplesPath}`);
} else {
  const errorString = new TextDecoder().decode(stderr);
  console.error(`Failed to format ${examplesPath}: ${errorString}`);
}
