export class KeyboardWidget {

    activeKeys: any = {};

    toggle: boolean = true;
    constructor() {
        const htmlElement = document.getElementById('keyboard-container');
        if (htmlElement) {
            htmlElement.addEventListener('click', this.onUserClick.bind(this));
            htmlElement.addEventListener('keydown', this.onUserKeyPress.bind(this));
            htmlElement.addEventListener('keyup', this.onUserKeyPress.bind(this));
        }
    }

    onUserClick(event: any) {

    }

    onUserKeyPress(event: any) {

        this.activeKeys[event.key] = (event.type === 'keydown');
        console.log('clicked', this.activeKeys);
        this.toggle = !this.toggle
        if (!this.toggle) {
            document.getElementById('test')?.classList.remove('active-key');
        } else {
            document.getElementById('test')?.classList.add('active-key');
        }
    }

    // c++ keyboard listener without interrupting flow
    // https://stackoverflow.com/questions/7798242/keyboard-mouse-input-in-c

    // compile c++ to js package
    // https://nodejs.org/api/addons.html#addons_addon_examples
}