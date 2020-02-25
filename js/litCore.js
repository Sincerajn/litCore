/*
 * @Author: Sincerajn
 * @Date: 2020-02-21 16:43:13
 * @LastEditors: Sincerajn
 * @LastEditTime: 2020-02-22 18:50:24
 */
/*
 * @Author: Sincerajn
 * @Date: 2020-02-13 13:10:05
 * @LastEditors: Sincerajn
 * @LastEditTime: 2020-02-22 12:58:08
 */

const jsKeywords = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"]
const jdObjects = ["Array", "Date", "Math", "Number", "Object", "String", "Boolean", "Map", "Set", "Regexp", "Promise"]

let lit = {
    // 传回 litCore 对象
    // core: (value) => {
    //     return new litCore(value)
    // },

    // 工具库
    unique: (array) => { // 数组去重
        return [...new Set(array)]
    },

    createElement: (tagName, text) => {
        if (tagName) {
            let element = document.createElement(tagName)
            if (typeof text === "string") {
                let texeNode = document.createTextNode(text)
                element.appendChild(texeNode)
            }
            return element
        }
        else
            return undefined
    },
    addElementInsertBefore: (container, element) => {
        if (container instanceof HTMLElement && element instanceof HTMLElement)
            container.insertBefore(element, container.querySelector(":first-child"))
        else
            return undefined
    },
    deleteElement: (element) => {
        element.parentElement.removeChild(element)
    },

    hasClass: (elements, inputClass) => {
        // if (elements instanceof HTMLElement)
        return elements.className.includes(inputClass)
        // else
        // throw "未传入 HTMLElement"
    },
    addClass: (elements, inputClass) => {
        if (elements instanceof HTMLElement) {
            if (!lit.hasClass(elements, inputClass))
                elements.className += ` ${inputClass}`
            else
                throw `${elements.localName} 已存在为 ${inputClass} 的 class`
        }
        else if (elements instanceof NodeList) {
            elements.forEach(e => {
                lit.addClass(e, inputClass)
            })
        }
        else
            throw "未传入任何元素"
    },
    removeClass: (elements, inputClass) => {
        if (elements instanceof HTMLElement) {
            let className = ""
            if (lit.hasClass(elements, ` ${inputClass}`)) { // 待查 class 前有空格的情况
                className = elements.className.replace(` ${inputClass}`, "")
                elements.className = className
            }
            else if (lit.hasClass(elements, inputClass)) { // 待查 class 前无空格的情况
                className = elements.className.replace(inputClass, "")
                elements.className = className
            }
            else {
                console.log('出错元素:', elements)
                throw new ReferenceError(`元素不存在为 "${inputClass}" 的 Class`)
            }
        }
        else if (elements instanceof NodeList) {
            elements.forEach(e => {
                lit.removeClass(e, inputClass)
            })
        }
        else
            throw "未传入任何元素"
    },
    toggleClass: (elements, inputClass) => {
        if (elements instanceof HTMLElement) {
            if (!lit.hasClass(elements, inputClass))
                lit.addClass(elements, inputClass)
            else
                lit.removeClass(elements, inputClass)
        }
        else if (elements instanceof NodeList) {
            elements.forEach(e => {
                lit.toggleClass(e, inputClass)
            })
        }
        else
            throw "未传入任何元素"
    },

    // 联动驱动方法
    toast: (message) => { // TODO: 由动画驱动改进为程序驱动
        const toast = document.createElement("lit-toast")
        toast.innerHTML = message
        document.querySelector("body").appendChild(toast)

        lit.core(toast).delete(3000)
    },
    cope: (input, btn, toast = "") => {
        btn.addEventListener("click", () => {
            input.select()
            if (document.execCommand("copy")) {
                document.execCommand("copy")
                if (toast != "")
                    lit.toast(toast)
                btn.focus()
            }
            else
                alert("浏览器不支持")
        })
    }
}

class litCore { // TODO: 核心库，需要扩充
    constructor(value) {
        this.log = () => {
            console.log(value)
        }

        if (value instanceof HTMLElement || document.querySelector(value)) {
            if (value instanceof HTMLElement)
                this.element = value
            else
                this.element = document.querySelector(value)

            this.delete = (delay = 0) => {
                setTimeout(() => {
                    lit.deleteElement(this.element)
                }, delay)
            }

            this.hasClass = (inputClass) => {
                return lit.hasClass(this.element, inputClass)
            }
            this.addClass = (inputClass) => {
                lit.addClass(this.element, inputClass)
            }
            this.removeClass = (inputClass) => {
                lit.removeClass(this.element, inputClass)
            }
            this.toggleClass = (inputClass) => {
                if (!this.hasClass(inputClass))
                    this.addClass(inputClass)
                else
                    this.removeClass(inputClass)
            }
            this.replaceClass = (changed, change) => { // TODO: 不满足条件时应提醒
                if (this.hasClass(changed) && !this.hasClass(change)) {
                    this.removeClass(changed)
                    this.addClass(change)
                }
            }

            this.click = (fun) => {
                this.element.addEventListener("click", fun)
            }
        }
    }
}

// 控件
export const Header = class Header extends litCore {
    constructor(selector = "header") {
        super(selector)
    }

    autoShadow() {
        if (document.documentElement.scrollTop == 0 && this.hasClass("-lit-sd"))
            this.removeClass("-lit-sd")
        else if (!this.hasClass("-lit-sd"))
            this.addClass("-lit-sd")
    }
}
export const ToUpBtn = class ToUpBtn extends litCore {
    constructor(selector = ".-lit-toUpBtn") {
        super(selector)

        this.click(() => window.scroll(0, 0))
    }

    autoShow() {
        if (document.documentElement.scrollTop <= window.innerHeight && this.hasClass("-lit-appear")) {
            this.removeClass("-lit-appear")
        }
        else if (document.documentElement.scrollTop > window.innerHeight && !this.hasClass("-lit-appear")) {
            this.addClass("-lit-appear")
        }
    }
}
export const CodeBox = class CodeBox extends litCore {
    constructor(selector = ".-lit-code") {
        super(selector)

        // FIXME: 精简代码
        let codeFormat = this.element.innerHTML

        // 单词处理
        let words = this.element.innerHTML.match(/\w+/g)
        lit.unique(words).forEach(word => {
            let reg = new RegExp(word, "g")

            if (jsKeywords.includes(word))
                codeFormat = codeFormat.replace(reg, `<span style = "color: var(--blue)">${word}</span>`)
            else if (jdObjects.includes(word))
                codeFormat = codeFormat.replace(reg, `<span style = "color: var(--teal)">${word}</span>`)
        })

        // 数字处理
        let numbers = this.element.innerHTML.match(/[0-9]+/g)
        lit.unique(numbers).forEach(number => {
            let reg = new RegExp(number, "g")

            codeFormat = codeFormat.replace(reg, `<span style = "color: var(--brown)">${number}</span>`)
        })

        // 字符串处理
        let strings = this.element.innerHTML.match(/(".+"|'.+')/g)
        lit.unique(strings).forEach(string => {
            let reg = new RegExp(string, "g")

            codeFormat = codeFormat.replace(reg, `<span style = "color: var(--green)">${string}</span>`)
        })

        this.element.innerHTML = codeFormat
    }
}

// 示例控件
function RenderExample() {
    let examples = document.querySelectorAll("lit-example")

    examples.forEach(example => {
        let demo = example.querySelector("lit-demo")
        let pre = example.querySelector("pre")

        // 添加按钮
        let exampleBtn = lit.createElement("lit-example-btn", "</>")
        lit.addElementInsertBefore(example, exampleBtn)

        // 添加标签
        let exampleLabel = lit.createElement("lit-example-label", "Example")
        lit.addElementInsertBefore(example, exampleLabel)

        exampleBtn.addEventListener("click", () => {
            lit.toggleClass(demo, "-lit-showcode")
            lit.toggleClass(pre, "-lit-showcode")
        })
    })
}

// 折叠面板控件
function RenderCollapse() {
    let collapses = document.querySelectorAll("lit-collapse")
    collapses.forEach(collapse => {
        let items = collapse.querySelectorAll("lit-collapse-item")
        items.forEach(item => { // 遍历折叠面板子项
            let titleText = item.getAttribute("title")
            let itemTitle = lit.createElement("lit-collapse-item-title", titleText)
            lit.addElementInsertBefore(item, itemTitle)

            // 初始化面板子项内容样式（隐藏）
            let itemContents = item.querySelectorAll(":not(lit-collapse-item-title)")
            itemContents.forEach(content => {
                lit.addClass(content, "-lit-hide")
                lit.addClass(content, "-lit-normal")
            })

            itemTitle.addEventListener("click", () => {
                lit.toggleClass(itemContents, "-lit-hide")
                lit.toggleClass(itemTitle, "-lit-clicked")
            })
        })
    })
}


class Textarea {
    constructor() {
        let textareas = document.querySelectorAll("textarea.-lit-textarea")
        textareas.forEach((textarea) => {
            const style = window.getComputedStyle(textarea)
            const paddingTop = parseFloat(style.paddingTop.replace("px", ""))
            const paddingBottom = parseFloat(style.paddingBottom.replace("px", ""))
            const padding = paddingTop + paddingBottom

            textarea.addEventListener("input", () => {
                textarea.style.height = "auto" // 处理删除触发缩短高度
                textarea.style.height = `${textarea.scrollHeight - padding}px`
            })
        })
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let textarea = new Textarea
    RenderExample()
    RenderCollapse()
})