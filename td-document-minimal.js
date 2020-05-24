/* td-document-minimal v.0.1.0, steenk 2020, license MIT.
   Minimal HTML document, made for running tripledollar in deno.
*/
function HTMLElement (name) {
  name = name || 'div';
  this.children = [];
  this.attributes = {};
  this.setAttribute = (name, value) => {
    this.attributes[name] = value;
  };
  this.getAttribute = (name) => {
    return this.attributes[name];
  }
  this.appendChild = (child) => {
    this.children.push(child);
  }
  Object.defineProperty(this, 'nodeType', {
    get() {
      return 1;
    }
  });
  Object.defineProperty(this, 'tagName', {
    get() {
      return name.toUpperCase();
    }
  });
  Object.defineProperty(this, 'id', {
    get() {
      return this.attributes.id;
    },
    set(value) {
      this.attributes.id = value;
    }
  });
  Object.defineProperty(this, 'outerHTML', {
    get() {
      let html = '<' + name;
      for (let attr in this.attributes) {
        if (attr != 'id') {
          html += ' ' + attr + '="' + this.attributes[attr] + '"';
        }
      }
      html += '>';
      for (let child of this.children) {
        if (child.nodeType === 1) {
          html += child.outerHTML;
        } else if (child.nodeType === 3) {
          html += child.data;
        }
      }
      html += '</' + name + '>';
      return html;
    }
  })
}
window.setImmediate = queueMicrotask;

HTMLElement.constructor = (name) => {
  let elem = new HTMLElement(name);
};
window.HTMLElement = HTMLElement;

window.document = {
  createElement(name) {
    return new window.HTMLElement(name)
  },
  createTextNode(text) {
    return {
      get data() {
        return text;
      },
      get nodeType() {
        return 3;
      }
    }
  }
}
window.document.firstElementChild = window.document.createElement('html');
window.document.firstElementChild.setAttribute('lang', 'en');
window.document.head = window.document.createElement('head');
let title = window.document.createElement('title');
title.appendChild(window.document.createTextNode('Title'));
window.document.head.appendChild(title);
window.document.body = window.document.createElement('body');
window.document.firstElementChild.appendChild(window.document.head);
window.document.firstElementChild.appendChild(window.document.body);
window.document.readyState = 'complete';
