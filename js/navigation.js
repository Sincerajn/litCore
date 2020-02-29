function createEl(tagName, attributes = { text, className, src, url }) {
    if (tagName) {
        let el = document.createElement(tagName)

        if (attributes.text) {
            let text = document.createTextNode(attributes.text)
            el.appendChild(text)
        }
        if (attributes.className) {
            el.className = attributes.className
        }
        if (attributes.src) {
            el.setAttribute("src", attributes.src)
        }

        return el
    }
    else
        return undefined
}

function hasClass(el, className) {
    if (el instanceof HTMLElement)
        return el.className.includes(className) ? true : false
    else
        throw "未传入 HTML 元素"
}

function addClass(el, className) {
    if (el instanceof HTMLElement && !hasClass(el, className)) {
        return el.className += " " + className
    }
    else
        return undefined
}

function removeClass(el, className) {
    if (el instanceof HTMLElement && hasClass(el, className)) {
        newClass = el.className.replace(` ${className}`, "")
        return el.className = newClass
    }
    else {
        return undefined
    }
}

function addEvent(el, fun, event = "click") {
    if (el instanceof HTMLElement)
        el.addEventListener(event, fun)
    else if (el instanceof NodeList) {
        el.forEach(e => {
            addEvent(e, fun, event)
        })
    }
    else
        return undefined
}

class SiteCard {
    constructor(name, description, url, logoSrc) {
        this.name = name
        this.description = description
        this.url = url
        this.logoSrc = logoSrc
    }

    render() {
        let card = createEl("div", { className: "site-card" })
        let title = createEl("span", { className: "site-title" })
        let logo = createEl("img", { className: "site-logo", src: this.logoSrc })
        let name = createEl("span", { className: "site-name", text: this.name })
        let description = createEl("span", { className: "site-description", text: this.description })

        card.appendChild(title)
        card.appendChild(description)
        title.appendChild(logo)
        title.appendChild(name)

        card.addEventListener("click", () => {
            window.location.href = this.url
        })

        return card
    }

    save(sites) {
        if (sites) {
            sites.push({
                name: this.name,
                description: this.description,
                url: this.url
            })

            store.set("sites", sites)
        }
    }
}

function siteCardFactory(site = { name, description, url }) {
    if (site.name != "" && site.description != "" && site.url != "https://") {
        if (!site.url.includes("https://") && !site.url.includes("http://"))
            site.url = "https://" + site.url

        let logoSrc = `https://www.google.com/s2/favicons?domain=${site.url}`

        return siteCard = new SiteCard(site.name, site.description, site.url, logoSrc)
    }
    else
        return undefined
}

function initSites() { // 初始化储存
    let sites = store.get("sites")
    if (!sites) {
        sites = [ // 默认站点卡片数据
            {
                name: "Github",
                description: "全球最大的代码托管平台与开源社区。",
                url: "github.com"
            },
            {
                name: "知乎",
                description: "与世界分享你的知识、经验与见解。上知乎，与世界分享你刚编的段子。",
                url: "zhihu.com"
            },
            {
                name: "哔哩哔哩",
                description: "全国最大的同性交友网站",
                url: "bilibili.com"
            }
        ]
    }
    return sites
}

function initRender(sites, box) { // 初始化站点卡片显示
    if (sites && box instanceof HTMLElement) {
        sites.forEach(site => {
            let siteCard = siteCardFactory({
                name: site.name,
                description: site.description,
                url: site.url
            })

            box.appendChild(siteCard.render())
        })
    }
    else
        throw "未传入有效值"
}

let sites = initSites()

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header")
    const search = document.querySelector("#search")
    const engines = document.querySelector(".engines")
    const enginesBtns = document.querySelectorAll(".engines button")

    const main = document.querySelector("main")
    const box = document.querySelector(".box")

    const addBtn = document.querySelector("#addSiteBtn")

    const addForm = document.querySelector("#addSiteForm")
    const nameInput = document.querySelector("#name")
    const descriptionInput = document.querySelector("#description")
    const urlInput = document.querySelector("#url")
    const cancel = document.querySelector("#cancel")
    const submit = document.querySelector("#submit")

    function addFormShow() {
        addClass(addForm, "show")
        addClass(main, "opacity")
        addClass(header, "opacity")
    }
    function addFormhide() {
        removeClass(addForm, "show")
        removeClass(main, "opacity")
        removeClass(header, "opacity")
    }

    initRender(sites, box)

    search.addEventListener("focus", () => addClass(engines, "show"))
    search.addEventListener("blur", () => removeClass(engines, "show"))

    enginesBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (search.value != "")
                window.location.href = `https://www.${btn.id}.com/search?q=${search.value}`
            else {
                search.setAttribute("placeholder", "输入搜索内容")
                search.focus()
            }
        })
    })

    addBtn.addEventListener("click", addFormShow)
    
    cancel.addEventListener("click", (e) => {
        e.preventDefault()
        addFormhide()
    })
    submit.addEventListener("click", (e) => {
        e.preventDefault()

        let siteCard = siteCardFactory({
            name: nameInput.value,
            description: descriptionInput.value,
            url: urlInput.value
        })

        if (siteCard) { // 站点卡片创造成功
            box.appendChild(siteCard.render())
            addFormhide()

            siteCard.save(sites)

            nameInput.value = ""
            description.value = ""
        }
        else {

        }
    })
})