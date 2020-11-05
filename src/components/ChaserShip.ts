import GameScene from "../scenes/GameScene";
import { SpriteConfig } from "./base/Ship";
import ComponentKeys from "../const/ComponentKeys";
import States from "../const/States";
import { GunShip } from "./GunShip";

export default class ChaserShip extends GunShip {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, explosionConfig?: SpriteConfig, bulletConfig?: SpriteConfig) {
        super(scene, x, y, texture, frame, explosionConfig, bulletConfig);

        this.setData("type", ComponentKeys.CHASER);
        this.state = States.MOVE;

        this.setRotation(Math.PI)
        this.body.velocity.y = Phaser.Math.Between(this.speed / 2, this.speed);
    }

    protected rotateFunc(player) {
        let currentPoint = new Phaser.Geom.Point(this.x, this.y + this.displayHeight / 2);
        let pointToMoveTo = new Phaser.Geom.Point(player.x, player.y);
        this.rotation = Phaser.Math.Angle.BetweenPoints(currentPoint, pointToMoveTo);
        this.rotation = this.rotation - Math.PI / 2
        this.scene.physics.moveToObject(this, player, this.speed / 2);
    }

    update() {
        const player = (this.scene as GameScene).playerShip;
        if (!this.getData("isDead") && player) {
            if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 320) {
                this.state = States.CHASE;
            }
            if (this.state == States.CHASE) {
                this.rotateFunc(player);


                // const dx = player.x - this.x;
                // const dy = player.y - this.y;
                // const angle = Math.atan2(dy, dx);
                // const speed = 100;

                // this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

                // //

                // if (this.x < player.x) {
                //     this.angle -= 5;
                // } else {
                //     this.angle += 5;
                // }
            }
        }
    }
}