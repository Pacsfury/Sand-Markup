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
    TXT: ["-TXT"]
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

        if (trimmedLine.startsWith("/id=")) {
            if (currentNode && indent === currentNode.indent + 1) {
                currentNode.attr["id"] = trimmedLine.split("/id=")[1].trim();
            }
            continue; 
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
    
    let idAttr = base.attr["id"] ? ` id="${base.attr["id"]}"` : "";

    if (base.type === NodeTypes.CONTENT) {
        if (base.mainvalue !== "Root") {
            html += `<div${idAttr}>`;
        }
        for (let child of base.children) {
            html += generateHTML(child);
        }
        if (base.mainvalue !== "Root") {
            html += "</div>\n";
        }
    } else if (base.type === NodeTypes.H1) {
        html += `<h1${idAttr}>${base.mainvalue}</h1>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H2) {
        html += `<h2${idAttr}>${base.mainvalue}</h2>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H3) {
        html += `<h3${idAttr}>${base.mainvalue}</h3>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H4) {
        html += `<h4${idAttr}>${base.mainvalue}</h4>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H5) {
        html += `<h5${idAttr}>${base.mainvalue}</h5>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.H6) {
        html += `<h6${idAttr}>${base.mainvalue}</h6>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    } else if (base.type === NodeTypes.TXT) {
        html += `<p${idAttr}>${base.mainvalue}</p>\n`;
        for (let child of base.children) {
            html += generateHTML(child);
        }
    }

    return html;
}
