import SceneKeys from "../const/SceneKeys";
import ResourceLoader from "../utils/ResourceLoader";

export default class PreloadScene extends Phaser.Scene {
    private loadingBar;
    constructor() {
        super({ key: SceneKeys.PRELOAD_SCENE });
    }
    preload(): void {
        this.loadingBar = this.add.sprite(0, 0, 'loadingBar').setOrigin(0, 0);
        Phaser.Display.Align.In.Center(this.loadingBar, this.add.zone(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height));

        this.load.on('progress', (value) => this.loadingBar.setScale(value, 1).setOrigin(0, 0));
        this.load.on('complete', () => {
            this.add.text(100, 100, "Loading Complete");
        });

        //load game assets
        ResourceLoader.load(this);

    }
    create(): void {
        this.scene.start('MenuScene');
    }
}