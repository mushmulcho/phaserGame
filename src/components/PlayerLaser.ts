import Entity from "./base/Entity";

export default class PlayerLaser extends Entity {
    constructor(scene: Phaser.Scene, x: number, y: number, type: string, texture: string, frame?: string) {
        super(scene, x, y, type, texture, frame);
        
        this.setBlendMode(1);
        this.setDepth(1);
        this.body.velocity.y = -600;
    }
}