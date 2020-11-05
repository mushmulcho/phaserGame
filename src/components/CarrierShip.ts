import Ship, { SpriteConfig } from "./base/Ship";
import ComponentKeys from "../const/ComponentKeys";
import { GunShip } from "./GunShip";
import GameScene from "../scenes/GameScene";
import PowerUp from "./PowerUp";
import TextureKeys from "../const/TextureKeys";

export default class CarrierShip extends Ship {
    protected powerUps: { type: string, texture: string, frame?: string }[];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, explosionConfig?: SpriteConfig) {
        super(scene, x, y, texture, frame, ComponentKeys.CARRIER, explosionConfig);
        this.init();
    }
    init() {
        this.setData(ComponentKeys.CARRIER);
        this.powerUps = [];
        this.powerUps.push(
            { type: ComponentKeys.POWER_UP_LIFE, texture: TextureKeys.LASERS, frame: TextureKeys.POWER_UP_LIFE },
            { type: ComponentKeys.POWER_UP_BULLET, texture: TextureKeys.LASERS, frame: TextureKeys.POWER_UP_BULLET },
            { type: ComponentKeys.POWER_UP_SHIELD, texture: TextureKeys.LASERS, frame: TextureKeys.POWER_UP_SHIELD }
        )
        this.body.velocity.y = Phaser.Math.Between(this.speed / 2, this.speed);
        //implement supply drop
    }
    onDestroy(): void {
        if (this.powerUps) {
            const power = this.powerUps[Phaser.Math.Between(0, this.powerUps.length - 1)];
            const powerUp = new PowerUp(this.scene, this.x, this.y, this.speed, power.type, power.texture, power.frame);
            (this.scene as GameScene).powerUps.add(powerUp);
        }

        super.onDestroy();
    }
}