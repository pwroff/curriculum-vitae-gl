
import {setStyle, Text} from "./Menu";
const parseContent = (content) =>
    content.map((n) => {
        if (Array.isArray(n)) {
            return '<p>' + n.join('<br />') + '</p>';
        }
        return n;
    }).join('<br />');


export default class Content {
    constructor(content = [], appendTo = document.querySelector('#content')) {
        const node = document.createElement('div');
        setStyle(node, {
            width: '800px',
            boxSizing: 'border-box',
            padding: '2rem',
            color: '#1a1a1a',
            margin: 'auto',
            maxWidth: '90%'
        });
        this.node = node;
        appendTo.appendChild(node);

        this.text = new Text({tag: 'p', text: parseContent(content), initial: ''});
        node.appendChild(this.text.node);
    }

    onTick(ts) {
        this.text.onTick(ts);
    }

    hide() {
        const now = Date.now();
        this.text.hide(now);
    }

    show() {
        const now = Date.now();
        this.text.show(now);
    }

    remove() {
        this.node.remove();
        delete this;
    }
}