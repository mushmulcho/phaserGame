export default class Entity extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number, type: string, texture: string,  frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.setData("type", type);
        this.setData("isDead", false);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
    }
    
    onDestroy(): void {
        this.destroy();
    }
}