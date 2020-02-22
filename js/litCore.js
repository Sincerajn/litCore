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

export let lit = {
    // 传回 litCore 对象
    core: (value) => {
        return new litCore(value)
    },

    // 工具库
    unique: (array) => { // 数组去重
        return [...new Set(array)]
    },
    deleteElement: (element) => {
        element.parentElement.removeChild(element)
    },
    hasClass: (element, inputClass) => {
        return element.className.includes(inputClass)
    },
    addClass: (element, inputClass) => {
        if (!lit.hasClass(element, inputClass))
            element.className += ` ${inputClass}`
        else {
            console.log('出错元素:', element)
            throw new ReferenceError(`元素已存在为 "${inputClass}" 的 Class`)
        }
    },
    removeClass: (element, inputClass) => {
        let className = ""
        if (lit.hasClass(element, ` ${inputClass}`)) { // 待查 class 前有空格的情况
            className = element.className.replace(` ${inputClass}`, "")
            element.className = className
        }
        else if (lit.hasClass(element, inputClass)) { // 待查 class 前无空格的情况
            className = element.className.replace(inputClass, "")
            element.className = className
        }
        else {
            console.log('出错元素:', element)
            throw new ReferenceError(`元素不存在为 "${inputClass}" 的 Class`)
        }
    },
    toggleClass: (element, inputClass) => {
        if (!lit.hasClass(element, inputClass))
            lit.addClass(element, inputClass)
        else
            lit.removeClass(element, inputClass)
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
export const Example = class Example {
    constructor() {
        let examples = document.querySelectorAll("lit-example")
        examples.forEach((example) => {
            let demo = example.querySelector("lit-demo")
            let pre = example.querySelector("pre")

            let exampleBtn = document.createElement("lit-example-btn")
            let exampleBtnText = document.createTextNode("</>")
            exampleBtn.appendChild(exampleBtnText)
            example.insertBefore(exampleBtn, demo)

            let exampleLabel = document.createElement("lit-example-label")
            let exampleLabelText = document.createTextNode("Example")
            exampleLabel.appendChild(exampleLabelText)
            example.insertBefore(exampleLabel, demo)

            exampleBtn.addEventListener("click", () => {
                lit.toggleClass(demo, "-lit-showcode")
                lit.toggleClass(pre, "-lit-showcode")
            })
        })
    }
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
    let example = new Example
    let textarea = new Textarea
})