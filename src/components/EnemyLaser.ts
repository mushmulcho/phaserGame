import Entity from "./base/Entity"

export default class EnemyLaser extends Entity {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, "EnemyLaser", texture, frame)

        this.body.velocity.y = 300;
    }
}