import Entity from "./base/Entity";

export default class Bullet extends Entity {

    protected speed: number;
    protected lifeSpan: number;
    protected velocity: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, rotation: number) {
        super(scene, x, y, texture, "Bullet", frame);

        this.speed = 1000;
        this.lifeSpan = 200;

        this.setBlendMode(1);
        this.setDepth(1);
        this.rotation = rotation + ((rotation <= 0 ? -Math.PI : Math.PI) / 2);
        this.setPosition(x, y);
        this.scene.physics.velocityFromRotation(rotation, this.speed, this.velocity);
        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;

    }

    update(): void {
        if (this.lifeSpan <= 0)
            this.setActive(false);
        else
            this.lifeSpan--;
    }

}