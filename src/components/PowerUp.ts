import Entity from "./base/Entity";

export default class PowerUp extends Entity {
    constructor(scene: Phaser.Scene, x: number, y: number, speed: number, type: string, texture: string, frame?: string) {
        super(scene, x, y, type, texture, frame);
        this.body.velocity.y = speed;
    }
}