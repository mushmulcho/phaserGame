import GameScene from "../scenes/GameScene";
import EnemyLaser from "./EnemyLaser";
import Ship, { SpriteConfig } from "./base/Ship";
import ComponentKeys from "../const/ComponentKeys";

export class GunShip extends Ship {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, explosionConfig?: SpriteConfig, bulletConfig?: SpriteConfig) {
        super(scene, x, y, texture, frame, ComponentKeys.GUN, explosionConfig, bulletConfig);

        this.init();
    }

    init() {
        this.autoFire = true;
        this.delayBetweenShoots = 2000;
        this.body.velocity.y = Phaser.Math.Between(this.speed / 2, this.speed);
        // this.setRotation(Math.PI / 2);

        if (this.autoFire && this.bulletConfig) {
            this.shootTimer = this.scene.time.addEvent({
                delay: this.delayBetweenShoots,
                callback: () => {
                    const laser = new EnemyLaser(this.scene, this.x, this.y, this.bulletConfig.texture, this.bulletConfig.frame);
                    laser.setScale(this.scaleX);
                    (this.scene as GameScene).enemyLasers.add(laser);
                },
                callbackScope: this,
                loop: this.autoFire
            })
        }

    }

    onDestroy(): void {
        super.onDestroy();
        this.destroy();
    }

}