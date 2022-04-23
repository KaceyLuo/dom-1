//新增一个节点
// window.dom = {
//     create(tagName) {
//         return document.createElement(tagName);
//     }
// };
// /*相当于
// window.dom={};
// dom.create=function(){};*/

/*如果要在div里面加标签的话 可以将标签当作一个字符串传进去
template内可以传任意标签*/
window.dom = {
    create(string) {
        const container = document.createElement("template");
        container.innerHTML = string.trim();//trim()的作用是去掉字符串两边的空格
        return container.content.firstChild;
    },
    //在节点后面新增一个节点
    after(node, node2) {
        //找到节点的父节点 调用父节点的.inserBefore的方法
        node.parentNode.insertBefore(node2, node.nextSibling);
    },
    //在节点前面新增一个节点
    before(node, node2) {
        node.parentNode.insertBefore(node2, node);
    },
    //新增子节点
    append(parent, node) {
        parent.appendChild(node);
    },
    //新增父节点
    wrap(node, parent) {
        //先将新增节点移到节点前面，再将节点插到新增节点里面。
        dom.before(node, parent)
        dom.append(parent, node)
    },
    //删除一个节点
    remove(node) {
        node.parentNode.removeChild(node);
        return node;
    },
    //删除一个节点的所有子节点
    empty(node) {
        //const { childNodes } = node;//等价于const childNodes=node.childNodes
        const array = [];
        let x = node.firstChild;
        while (x) {
            array.push(dom.remove(node.firstChild));
            x = node.firstChild;
        }
        return array;
    },
    //用于读写属性 （重载）
    attr(node, name, value) {
        if (arguments.length === 3) {
            node.setAttribute(name, value)
        } else if (arguments.length === 2) {
            return node.getAttribute(name);
        }
    },
    //用于读写文本内容
    //读写的标签内若有其他标签 改写时会被文本内容代替 可以考虑设置一个独立标签
    text(node, string) {
        //node.innerHTML=string;//ie
        //node.textContent=string;//firefox chrome
        //适配
        if (arguments.length === 2) {
            if ('innerText' in node) {
                node.innerText = string;
            } else {
                node.textContent = string;
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText;
            } else {
                return node.textContent;
            }
        }
    },
    //用于HTML的读写
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string;
        } else if (arguments.length === 1) {
            return node.innerHTML;
        }
    },
    //用于style的读写
    style(node, name, value) {
        if (arguments.length === 3) {
            //dom.style(div,'color','red') 想要修改
            node.style[name] = value;
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                //dom.style(aiv,'color') 想要读取
                return node.style[name];
            } else if (name instanceof object) {
                //dom.style(div,{color:'red'})
                for (let key in name) {
                    //key:border/color
                    //如果key是一个变量的话需要将key用[]括起来,否则key就会变成字符串
                    node.style[key] = name[key];
                }
            }
        }
    },
    //添加class 删除class 查看class
    class: {
        add(node, className) {
            node.classList.add(className);
        },
        remove(node, className) {
            node.classList.remove(className);
        },
        has(node, className) {
            return node.classList.contains(className);
        }
    },
    //添加事件监听
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn);
    },
    //删除事件监听
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn);
    },
    //在一个范围内查找
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector);
    },
    //找一个节点的父节点
    parent(node) {
        return node.parentNode;
    },
    //找一个节点的孩子
    children(node) {
        return node.children;
    },
    //找一个节点的兄弟姐妹
    sibling(node) {
        Array.from(node.parentNode.children).filter(n => n !== node);
    },
    //找节点的弟弟
    next(node) {
        let x = node.nextSibling;
        while (x && x.nodeType === 3) {
            x = x.nextSibling;
        }
        return x;
    },
    //找节点的哥哥
    previous(node) {
        let x = node.previousSibling;
        while (x && x.nodeType === 3) {
            x = x.previousSibling;
        }
        return x;
    },
    //遍历所有节点
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i]);
        }
    },
    //查看节点的排行
    index(node) {
        const list = dom.children(node.parentNode)
        let i;
        for (let i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break;
            }
        }
        return i;
    }
};