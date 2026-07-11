document.getElementById("code").addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        
        const start = this.selectionStart;
        const end = this.selectionEnd;

        this.value = this.value.substring(0, start) + "    " + this.value.substring(end);

        this.selectionStart = this.selectionEnd = start + 4;

        this.dispatchEvent(new Event('input'));
    }
});


document.getElementById("code").addEventListener('input', () => {
    execute();
});


function execute() {
    document.getElementById("htmlresult").srcdoc = transpile(document.getElementById("code").value);
}

const NodeTypes = Object.freeze({
    CONTENT: ["-CONTENT"],
    H1: ["-H1"],
    H2: ["-H2"],
    H3: ["-H3"],
    H4: ["-H4"],
    H5: ["-H5"],
    H6: ["-H6"],
    TXT: ["-TXT"],
    BOX: ["-BOX"]
});

class Node {
    constructor(type, mainvalue = "", indent = 0) {
        this.type = type;
        this.mainvalue = mainvalue;
        this.children = [];
        this.indent = indent;
        this.attr = {};
    }
}

function calcindent(actline) {
    let indent = 0;
    while (actline.startsWith("    ")) {
        actline = actline.substring(4);
        indent++;
    }
    return indent;
}

function transpile(code) {
    let lines = code.split('\n');
    let root = new Node(NodeTypes.CONTENT, "Root", -1);
    let nodeHistory = [root];
    
    let currentNode = root;

    for (let i = 0; i < lines.length; i++) {
        let actline = lines[i];
        
        if (actline.trim() === "") continue;
        
        let indent = calcindent(actline);
        let trimmedLine = actline.trim();

        if (trimmedLine.startsWith("/")) {
            let eqIndex = trimmedLine.indexOf("=");
            if (eqIndex > 1) {
                let attrName = trimmedLine.substring(1, eqIndex).trim();
                let attrValue = trimmedLine.substring(eqIndex + 1).trim();
                
                if (currentNode && indent === currentNode.indent + 1) {
                    currentNode.attr[attrName] = attrValue;
                }
                continue;
            }
        }

        let newNode = null;
        if (trimmedLine.startsWith("-CONTENT:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.CONTENT, value, indent);
        } else if (trimmedLine.startsWith("-H1:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.H1, value, indent);
        } else if (trimmedLine.startsWith("-H2:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.H2, value, indent);
        } else if (trimmedLine.startsWith("-H3:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.H3, value, indent);
        } else if (trimmedLine.startsWith("-H4:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.H4, value, indent);
        } else if (trimmedLine.startsWith("-H5:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.H5, value, indent);
        } else if (trimmedLine.startsWith("-H6:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.H6, value, indent);
        } else if (trimmedLine.startsWith("-TXT:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.TXT, value, indent);
        } else if (trimmedLine.startsWith("-BOX:")) {
            let value = trimmedLine.substring(trimmedLine.indexOf(":") + 1).trim();
            newNode = new Node(NodeTypes.BOX, value, indent);
        } else {
            continue;
        }

        if (newNode) {
            while (nodeHistory.length > 0 && nodeHistory[nodeHistory.length - 1].indent >= indent) {
                nodeHistory.pop();
            }

            let parentNode = nodeHistory[nodeHistory.length - 1];
            parentNode.children.push(newNode);
            nodeHistory.push(newNode);
            
            currentNode = newNode; 
        }
    }

    return generateHTML(root);
}

function generateHTML(base) {
    let html = "";
    
    let NodeAtr = Object.entries(base.attr)
        .map(([key, val]) => ` ${key}="${val}"`)
        .join("");

    if (base.type === NodeTypes.CONTENT) {
        if (base.mainvalue !== "Root") {
            html += `<div${NodeAtr}>`;
        }
        for (let child of base.children) {
            html += generateHTML(child);
        }
        if (base.mainvalue !== "Root") {
            html += "</div>\n";
        }
    } else if (base.type === NodeTypes.BOX) {
        html += `<div id="${base.mainvalue}"${NodeAtr}>`;

        for (let child of base.children) {
            html += generateHTML(child);
        }

        html += "</div>\n";
    } else if (base.type === NodeTypes.H1) {
        html += `<h1${NodeAtr}>${base.mainvalue}</h1>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H2) {
        html += `<h2${NodeAtr}>${base.mainvalue}</h2>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H3) {
        html += `<h3${NodeAtr}>${base.mainvalue}</h3>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H4) {
        html += `<h4${NodeAtr}>${base.mainvalue}</h4>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H5) {
        html += `<h5${NodeAtr}>${base.mainvalue}</h5>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H6) {
        html += `<h6${NodeAtr}>${base.mainvalue}</h6>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.TXT) {
        html += `<p${NodeAtr}>${base.mainvalue}</p>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    }

    return html;
}
