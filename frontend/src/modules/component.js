import { CurrentPage } from "./current_page";

export class Component {
    constructor(page) {
        this.page = page;
        this.components = {};
        this.getingTags = true;

        // setInterval(() => {
        //     this.init()
        // }, 10);

        
        this.listener();
    }

    listener() {
        // if (CurrentPage.page != this.page) {
        //     return;
        // }
        if(!this.getingTags) {
            return;
        }
        this.init();
        requestAnimationFrame(this.listener.bind(this));
    }

    init() {
        let html = document.getElementsByTagName('html')[0];

        if (!html) {
            return;
        }

        let htmlCode = html.innerHTML;

        let compTagReg = new RegExp(/{{(?=[^}]*[a-z])[^}]*}}/g);
        let match = htmlCode.match(compTagReg);
        console.log(match)
        
        if (match == null) {
            // this.getingTags = false
            return;
        }
        let tagsClass = match.forEach(tag => {
            let newTag = tag.replace('{{', '').replace('}}', '');
            newTag = newTag.split(' ');
            let el = document.createElement(newTag[0]);
            el.classList.add(newTag[1]);
            this.components[newTag[1]] = el;
            console.log(el);
            console.log(tag)
            html.innerHTML = html.innerHTML.replace(tag, el);
        });
        try {
            this.page.runJs();
        } catch (e) {
            // 
        }
        this.getingTags = false;
    }
}