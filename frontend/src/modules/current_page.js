export class CurrentPage {
    static page = null;

    static get() {
        return this.page;
    }

    static save(page) {
        this.page = page;
    }

    static remove() {
        if (this.page) {
            this.page = null;
        }
    }
}