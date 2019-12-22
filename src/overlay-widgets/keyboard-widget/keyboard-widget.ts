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
        this.handleUserInput();
    }

    handleUserInput(): boolean {
        const activeKeys = Object.keys(this.activeKeys).filter((key) => {
            const isPressed = this.activeKeys[key];
            if (isPressed) {
                document.getElementById(key)?.classList.add('active-key');
            } else {
                document.getElementById(key)?.classList.remove('active-key');
            }
        });
        return activeKeys.length > 0;
    }

    // c++ keyboard listener without interrupting flow
    // https://stackoverflow.com/questions/7798242/keyboard-mouse-input-in-c

    // compile c++ to js package
    // https://nodejs.org/api/addons.html#addons_addon_examples
}