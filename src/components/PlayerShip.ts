import Bullet from "./Bullet";
import ComponentKeys from "../const/ComponentKeys";
import Ship, { SpriteConfig } from "./base/Ship";
import PlayerLaser from "./PlayerLaser";
import GameScene from "../scenes/GameScene";

export default class PlayerShip extends Ship {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, explosionConfig?: SpriteConfig, bulletConfig?: SpriteConfig) {

        super(scene, x, y, texture, frame, ComponentKeys.PLAYER_LASER);

        this.setData(PlayerKeys.SPEED, 400);
        this.setData(PlayerKeys.IS_SHOOTING, false);
        this.setData(PlayerKeys.IS_EXPLOSION_COMPLETE, false);
        this.setData(PlayerKeys.TIMER_SHOOT_DELAY, 10);
        this.setData(PlayerKeys.TIMER_SHOOT_TICK, this.getData(PlayerKeys.TIMER_SHOOT_DELAY) - 1);

        this.bulletConfig = bulletConfig;
        this.explosionConfig = explosionConfig;
        this.rotation =  -Math.PI / 2;
        
        //add physics
        this.setDepth(2);

    }

    moveUp(): void {
        this.body.velocity.y = -this.getData(PlayerKeys.SPEED);
    }

    moveDown(): void {
        this.body.velocity.y = this.getData(PlayerKeys.SPEED);
    }

    moveForward(): void {
        this.body.velocity.x = this.getData(PlayerKeys.SPEED);
    }

    moveBackward(): void {
        this.body.velocity.x = -this.getData(PlayerKeys.SPEED);
    }

    // shoot(): void {
    //     const bullet: Bullet = new Bullet(this.scene, this.x, this.y, this.bulletConfig.texture, this.bulletConfig.frame, this.rotation);
    //     this.bulletsGroup.add(bullet);
    // }

    update(): void {
        this.body.velocity.x = this.body.velocity.y = 0;

        this.x = Phaser.Math.Clamp(this.x, 0, +this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, +this.scene.game.config.height);

        if (this.getData(PlayerKeys.IS_SHOOTING)) {
            if (this.getData(PlayerKeys.TIMER_SHOOT_TICK) < this.getData(PlayerKeys.TIMER_SHOOT_DELAY)) {
                this.setData(PlayerKeys.TIMER_SHOOT_TICK, this.getData(PlayerKeys.TIMER_SHOOT_TICK) + 1);
            } else if (this.bulletConfig) {
                const laser = new PlayerLaser(this.scene, this.x, this.y, ComponentKeys.PLAYER_LASER, this.bulletConfig.texture, this.bulletConfig.frame);
                (this.scene as GameScene).playerLasers.add(laser);

                (this.scene as GameScene).audio.laser.play();
                this.setData(PlayerKeys.TIMER_SHOOT_TICK, 0);
            }
        }
    }

    onDestroy(): void {
        if(!this.getData("isDead") && this.explosionConfig){
            this.createExplosion();
        }
        this.bulletConfig = null;
        this.explosionConfig = null;
        this.setActive(false);
        this.setVisible(false);
        this.setData(PlayerKeys.IS_SHOOTING, false);

        super.onDestroy();
    }
    //Private
    protected createExplosion(): void {
        if (!this.explosionConfig)
            return;

        const explosion: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.x, this.y, this.explosionConfig.texture, this.explosionConfig.frame).setScale(0.1).setBlendMode(1);

        this.scene.tweens.add({
            targets: explosion,
            props: {
                scaleX: { value: 1, ease: 'Power1' },
                scaleY: { value: 1, ease: 'Power1' },
                alpha: { value: 0 }
            },
            duration: 2000,
            yoyo: false,
            onCompleteScope: this,
            onComplete: () => {
                explosion.destroy();
                this.setData(PlayerKeys.IS_EXPLOSION_COMPLETE, true);
            }
        })
    }
}

export enum PlayerKeys {
    IS_SHOOTING = "isShooting",
    IS_EXPLOSION_COMPLETE = "isExplosionComplete",
    TIMER_SHOOT_TICK = "timerShootTick",
    TIMER_SHOOT_DELAY = "timerShootDelay",
    SPEED = "speed"
}

