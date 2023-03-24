import { type Plugin } from 'esbuild';
import ora from 'ora';
import chalk from 'chalk';

export function esbuildProgressPulgin(options?: { message?: string }): Plugin {
  const message = options?.message || 'Building';
  const spinner = ora();

  return {
    name: 'progress',
    setup(build) {
      build.onStart(async () => {
        console.log(
          chalk.green(
            `🔔 New Build Incoming! ${new Date().toLocaleTimeString()}`,
          ),
        );

        spinner.start(message + '\n');
        return null;
      });
      build.onEnd((result) => {
        result.errors.length
          ? spinner.fail(
              `Build failed. ${new Date().toLocaleTimeString()}. ${
                result.errors.length
              } error${result.errors.length > 1 ? 's' : ''}`,
            )
          : spinner.succeed(
              `Build successful. ${new Date().toLocaleTimeString()}`,
            );
      });
    },
  };
}
