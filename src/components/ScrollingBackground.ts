export default class ScrollingBackground {

    protected scene: Phaser.Scene;
    protected key: string;
    protected velocityY: number
    protected layers: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, key: string, velocityY: number) {
        this.scene = scene;
        this.key = key;//stars
        this.velocityY = this.velocityY;

        this.layers = this.scene.add.group();

        this.createLayers();
    }

    protected createLayers() {
        for (let i = 0; i < 2; i++) {
            const flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            const flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            const layer = this.scene.add.sprite(0, 0, this.key);
            layer.y = layer.displayHeight * i;
            layer.setScale(flipX * 2, flipY * 2);
            layer.setDepth(-5 - (i - 1));

            this.scene.physics.world.enableBody(layer, 0);
            layer.body.velocity.y = this.velocityY;
            this.layers.add(layer);
        }
    }
}