import Entity from "./Entity";

export default class Ship extends Entity {

    protected delayBetweenShoots: number = 1000;
    protected speed: number = 100;
    protected autoFire: boolean = false;
    protected shootTimer: Phaser.Time.TimerEvent;
    protected explosionConfig: SpriteConfig;
    protected bulletConfig: SpriteConfig;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, shipName: string, explosionConfig?: SpriteConfig, bulletConfig?: SpriteConfig) {
        super(scene, x, y, shipName, texture, frame);
        this.explosionConfig = explosionConfig;
        this.bulletConfig = bulletConfig;
    }

    onDestroy(): void {
        if (this.shootTimer) {
            this.shootTimer.remove(false);
        }
        this.setAngle(0);
        this.setData("isDead", true);
    }
}

export type SpriteConfig = {
    texture: string;
    frame: string;
}