export default class MultyKeys {

    public up: Phaser.Input.Keyboard.Key;
    public down: Phaser.Input.Keyboard.Key;
    public left: Phaser.Input.Keyboard.Key;
    public right: Phaser.Input.Keyboard.Key;
    public fire:Phaser.Input.Keyboard.Key;
    protected scene:Phaser.Scene;

    constructor(scene: Phaser.Scene, keys: Keys) {
        this.scene = scene;

        Object.keys(keys).forEach(key => {
            this[key]= this.scene.input.keyboard.addKey(keys[key]);
        })
    }
}
interface Keys {
    up: number;
    down: number;
    left: number;
    right: number;
    fire:number;
}