
export const setStyle = (node, style) => {
    for (let k of Object.keys(style)) {
        node.style[k] = style[k];
    }
};
export const setAttribute = (node, attrs) => {
    for (let k of Object.keys(attrs)) {
        node.setAttribute(k, attrs[k]);
    }
};

export class Text {
    constructor({tag, text, style = {}, initial = text}) {
        this.text = text;
        this.targetText = text;
        this.currentTextLength = initial.length;
        this.node = document.createElement(tag);
        this.node.innerHTML = this.text.substr(0, this.currentTextLength);
        const testNode = document.createElement(tag);
        testNode.innerHTML = text;
        this.maxLength = testNode.innerHTML.length;
        setStyle(this.node, style);
        this.startA = 0;
    }

    execute(ds) {
        const ttL = this.targetText.length;
        const ctL = this.currentTextLength;
        const nLL = this.node.innerHTML.length;

        if (nLL === ttL || this.currentTextLength > this.maxLength) {
            this.node.innerHTML = this.targetText;
            return this.startA = 0;
        }
        this.currentTextLength = ctL + (ttL - ctL)*ds*4;
        this.node.innerHTML = this.text.substr(0, Math.round(this.currentTextLength));
    }

    onTick(ds) {
        if (this.startA > 0) {
            this.execute(ds);
        }
    }

    hide(ts) {
        this.startA = ts;
        this.targetText = '';
    }

    show(ts) {
        this.startA = ts;
        this.targetText = this.text;
    }
}

class Link extends Text {
    constructor({text, style = {}, content}) {
        super({text, style: {
            color: '#ef5216',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '1.5em',
            margin: 0,
            position: 'relative',
            boxSizing: 'border-box',
            padding: '.2rem',
            lineHeight: '35px',
            display: 'block',
            width: 'auto',
            ...style
        }, tag: 'li'});
        this.node.className = 'absEmpty';

        this.isActive = false;
        this.content = content;
        this.targetMove = 0;
        this.move = 0;
        this.startB = 0;
    }

    buttonExecute(ds) {
        const next = (this.targetMove - this.move)*ds*5;
        this.move += next;
        if (Math.abs(next) <= 0.01) {
            this.startB = 0;
            this.move = this.targetMove;
        }
        this.node.style.left = `${this.move}px`;
    }

    onTick(ds) {
        super.onTick(ds);
        if (this.isActive && this.startB > 0) {
            return this.buttonExecute(ds);
        }
    }

    hide(ts, ...args) {
        if (this.isActive) {
            this.startB = ts;
            this.targetMove = 50;
            return;
        }
        return super.hide(ts, ...args);
    }

    show(ts, ...args) {
        if (this.isActive) {
            this.startB = ts;
            this.targetMove = 0;
            return;
        }
        return super.show(ts, ...args);
    }
}

export default class Menu {
    constructor(links = []) {
        const plc = document.createElement('ul');
        this.links = links.map((link) => {
            const li = new Link(link);
            plc.appendChild(li.node);
            return li;
        });
        setStyle(plc, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'auto',
            maxWidth: '450px',
            padding: '20px',
            zIndex: 3
        });
        this.node = plc;
        document.body.appendChild(plc);
        this.isOpen = true;
    }

    onTick(ts) {
        this.links.forEach((l) => {l.onTick(ts)});
    }

    hide() {
        const now = Date.now();
        this.links.forEach((l) => {l.hide(now)});
        this.isOpen = false;
    }

    show() {
        const now = Date.now();
        this.links.forEach((l) => {l.show(now)});
        this.isOpen = true;
    }
}
