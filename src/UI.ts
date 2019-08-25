import { Terminal } from "xterm";

export class UI {
  private term: Terminal;

  log(s: string): void {
    this.term.write(s + "\r\n")
  }

  start(): void {
    const term = new Terminal({
      cols: 60,
      rows: 20
    });
    term.open(document.getElementById("xterm"));

    const prompt = () => {
      term.write("\r\n# ");
    };

    term.writeln("Welcome to xterm.js");
    prompt();

    term.on("key", function(key, ev) {
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.keyCode === 13) {
        prompt();
      } else
      if (ev.keyCode === 8) {
        term.write("\b \b");
      } else
      if (printable) {
        term.write(key);
        console.log(term)
      }
    });

    term.on("paste", function(data) {
      term.write(data);
    });

    term.focus()
    this.term = term
  }
}
