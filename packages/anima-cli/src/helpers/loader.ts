import ora from 'ora';
import { log } from './log';

class AnimaLoader {
  #loader: ora.Ora;
  #currentStage = '';

  constructor() {
    this.#loader = ora();
  }

  #formatMessage(msg: string) {
    return `${msg}...\n`;
  }

  newStage(msg: string, showLog = true) {
    const formattedMsg = this.#formatMessage(msg);
    if (this.#currentStage !== '') {
      this.#loader.stop();
      showLog && log.green(`  - ${this.#currentStage} ...OK`);
    }
    this.#currentStage = msg;
    this.#loader.start(formattedMsg);
  }

  stop(showLog = false) {
    this.#loader.stop();
    if (this.#currentStage !== '') {
      showLog && log.green(`  - ${this.#currentStage} ...OK`);
      this.#currentStage = '';
    }
  }
}

const loader = new AnimaLoader();
export { loader };
