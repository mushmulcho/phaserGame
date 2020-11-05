import SceneKeys from "../const/SceneKeys";
import ResourceLoader from "../utils/ResourceLoader";

export default class BootScene extends Phaser.Scene {
    constructor(){
        super({key:SceneKeys.BOOT_SCENE});
    }
    preload(): void{
        ResourceLoader.load(this);
    }
    create():void {

    }
    update(): void{
        this.scene.start('PreloadScene');
    }
}