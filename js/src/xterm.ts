import * as bare from "xterm";

bare.loadAddon("fit");

export class TermXterm {
    elem: HTMLElement;

    message: HTMLElement;
    messageTimeout: number;
    messageTimer: number;

    term: bare;
    resizeListener: () => void;

    constructor(elem: HTMLElement) {
        this.elem = elem;
        this.term = new bare();

        this.message = elem.ownerDocument.createElement("div");
        this.message.className = "xterm-overlay";
        this.messageTimeout = 2000;


        let resizing;
        this.resizeListener = () => {
            if (resizing != null) {
                clearTimeout(resizing);
            }
            resizing = setTimeout(() => {
                this.term.fit();
                this.term.reset(); // remove unnecessary scroll back
            }, 200);
        };

        this.term.on("open", () => {
            this.resizeListener();
            window.addEventListener("resize", this.resizeListener);
        });


        this.term.open(elem, true);
    };

    write(data: string) {
        this.term.write(data);
    };

    showMessage(message: string, timeout: number) {
        console.log(message);
        this.message.textContent = message;
        this.elem.appendChild(this.message);

        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }
        if (timeout > 0) {
            this.messageTimer = setTimeout(() => {
                this.elem.removeChild(this.message);
            }, timeout);
        }
    };

    setWindowTitle(title: string) {
        document.title = title;
    };

    setPreferences(value: object) {
    };

    onInput(callback: (input: string) => void) {
        this.term.on("data", (data) => {
            callback(data);
        });

    };

    onResize(callback: (colmuns: number, rows: number) => void) {
        this.term.on("resize", (data) => {
            this.showMessage(String(data.cols) + " x " + String(data.rows), this.messageTimeout);
            callback(data.cols, data.rows);
        });
    };

    removeEventListeners(): void {
        this.term.off("data");
        this.term.off("resize");
    }

    close() {
        window.removeEventListener("resize", this.resizeListener);
        this.term.destroy();
    }
}
