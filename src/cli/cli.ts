import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { createFimModelFromYaml } from '../recurrences/formats/model-from-yaml';

export const run = async (): Promise<void> => {
  const program = new Command();
  program.requiredOption('-f, --file <file>');
  program.parse();
  const file: string = program['file'];
  const fileText = (await readFile(file)).toString('utf-8');
  const model = createFimModelFromYaml(fileText);
  const start = new Date();
  const end = new Date(start);
  end.setFullYear(start.getFullYear() + 100);
  const results = model.verify(start, end);
  for (const { goal, result } of results) {
    if (result.type === 'passed') {
      console.log(`Goal [${goal.getName()}] PASSED.`);
    } else {
      console.log(
        `Goal [${goal.getName()}] FAILED on [${result.on}] ([${
          result.message
        }]).`
      );
    }
  }
};
