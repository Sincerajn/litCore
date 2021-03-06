const jsKeywords = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"]
const jdObjects = ["Array", "Date", "Math", "Number", "Object", "String", "Boolean", "Map", "Set", "Regexp", "Promise"]

let lit = {
    // 传回 litCore 对象
    // core: (value) => {
    //     return new litCore(value)
    // },

    // 工具库
    unique: (array) => [...new Set(array)], // 数组去重
    random: (x, y, step = 0) => {
        let range = y - x
        let r = Math.random() * range + x
        return Number(r.toFixed(step))
    },

    // 函数防抖
    debounce: (fun, wait) => {
        let timeout = null

        return function () {
            if (timeout !== null) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(fun, wait)
        }
    },
    // 函数节流
    throttle: (fun, delay) => {
        let prev = Date.now()
        return function () {
            let context = this
            let args = arguments
            let now = Date.now()

            if (now - prev >= delay) {
                fun.apply(context, args)
                prev = Date.now()
            }
        }
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
        if (elements instanceof HTMLElement)
            return elements.className.includes(inputClass)
        else
            throw "未传入 HTMLElement"
    },
    addClass: (elements, inputClass) => {
        if (elements instanceof HTMLElement) {
            if (!lit.hasClass(elements, inputClass))
                elements.className += ` ${inputClass}`
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
                console.log(`${elements}元素不存在为 "${inputClass}" 的 Class`)
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
class Header extends litCore {
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
class ToUpBtn extends litCore {
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
class CodeBox extends litCore {
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
function renderExample() {
    let examples = document.querySelectorAll("lit-example")
    if (!examples) return

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
function renderCollapse() {
    let collapses = document.querySelectorAll("lit-collapse")
    if (!collapses) return

    collapses.forEach(collapse => {
        let items = collapse.querySelectorAll("lit-collapse-item")
        items.forEach(item => { // 遍历折叠面板子项
            // 动态生成 item-title 元素
            let titleText = item.getAttribute("-title")
            let itemTitle = lit.createElement("lit-collapse-item-title", titleText)
            collapse.insertBefore(itemTitle, item)

            let height = function () {
                lit.addClass(item, "-getHeight")
                let height = window.getComputedStyle(item).height
                lit.removeClass(item, "-getHeight")
                return height
            }()

            function toggleItem(item) {
                lit.toggleClass(item, "-show")
                lit.hasClass(item, "-show") ? item.style.height = height : item.style.height = 0
            }

            itemTitle.addEventListener("click", () => {
                toggleItem(item)

                if (lit.hasClass(collapse, "-accordion") && lit.hasClass(item, "-show")) { //手风琴效果
                    items.forEach(e => {
                        if (e != item && lit.hasClass(e, "-show")) {
                            toggleItem(e)
                        }
                    })
                }
            })
        })
    })
}

// 抽屉导航控件
function renderDrawer() {
    let main = document.querySelector("lit-main, main")
    let other = document.querySelectorAll("body > :not(lit-drawer)")
    let drawer = document.querySelector("lit-drawer")
    let menuBtn = document.querySelector("lit-menu-btn")
    let headerHeight = document.querySelector("lit-header").scrollHeight
    if (!drawer) return

    function hideEvent() { // 用于保留于内存
        hideDrawer()
        lit.removeClass(other, "-opacity-3")

        other.forEach(e => {
            e.removeEventListener("click", hideEvent)
        })
    }
    function showDrawer() {
        lit.addClass(drawer, "-show")
    }
    function hideDrawer() {
        lit.removeClass(drawer, "-show")
    }
    function getDriveType() {
        if (document.body.clientWidth <= 425)
            return "phone"
        else if (document.body.clientWidth <= 1024)
            return "pad"
        else
            return "pc"
    }
    function modifyHeaderHeight() {
        drawer.style.height = `calc(100vh - ${headerHeight}px)`
        drawer.style.top = `${headerHeight}px`
    }

    let toggleDrawer = () => { //FIXME: 当宽度改变时无法去除遮罩
        if (getDriveType() != "pc") {
            if (getDriveType() == "pad") {
                other = document.querySelectorAll("body > :not(lit-drawer):not(lit-header)")
            }

            if (!lit.hasClass(drawer, "-show")) {
                showDrawer()
                lit.addClass(other, "-opacity-3")

                other.forEach(e => {
                    e.addEventListener("click", hideEvent)
                })
            }
            else if (lit.hasClass(drawer, "-show")) {
                hideDrawer()
                lit.removeClass(other, "-opacity-3")
            }
        }
        else {
            lit.toggleClass(drawer, "-show")
            lit.toggleClass(main, "-drawerShow")
        }
    }

    menuBtn.addEventListener("click", (event) => {
        toggleDrawer()
        event.stopPropagation()
    })

    if (getDriveType() == "pc") {
        modifyHeaderHeight()
        toggleDrawer()
    }
    else if (getDriveType() == "pad") {
        modifyHeaderHeight()
    }
}

// 多行输入框控件
function renderTextarea() {
    let textareas = document.querySelectorAll("textarea.-lit")
    if (!textareas) return

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

// 黏着阴影顶栏控件
function renderHeader() {
    let header = document.querySelector("lit-header")
    if (!header) return

    if (header.getAttribute('lit-sticky') === null) return

    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop != 0) {
            lit.addClass(header, '-shadow -sticky')
        }
        else {
            lit.removeClass(header, '-shadow -sticky')
        }
    })
}


document.addEventListener("DOMContentLoaded", () => {
    renderTextarea()
    renderExample()
    renderCollapse()
    renderDrawer()
    renderHeader()
})