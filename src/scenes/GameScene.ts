import AnimationConfig from "../configs/AnimationConfig";
import Asteroid from "../components/Asteroid";
import Ship from "../components/base/Ship";
import Bullet from "../components/Bullet";
import MenuScene from "./MenuScene";
import TextureKeys from "../const/TextureKeys";
import SoundKeys from "../const/SoundKeys";
import SceneKeys from "../const/SceneKeys";
import { GunShip } from "../components/GunShip";
import ChaserShip from "../components/ChaserShip";
import CarrierShip from "../components/CarrierShip";
import PlayerShip, { PlayerKeys } from "../components/PlayerShip";
import EnemyLaser from "../components/EnemyLaser";
import PlayerLaser from "../components/PlayerLaser";
import ScrollingBackground from "../components/ScrollingBackground";
import PowerUp from "../components/PowerUp";
import ComponentKeys from "../const/ComponentKeys";
import PlayerModel from "../models/PlayerModel";
import MultyKeys from "../utils/MultyKeys";

export default class GameScene extends Phaser.Scene {
    static LEVEL: number = 1;
    static TOP_LEFT_POSITION: number;
    static TOP_RIGHT_POSITION: number;

    public enemies: Phaser.GameObjects.Group;
    public enemyLasers: Phaser.GameObjects.Group;
    public playerLasers: Phaser.GameObjects.Group;
    public asteroidGroup: Phaser.GameObjects.Group;
    public powerUps: Phaser.GameObjects.Group;
    public playerShip: PlayerShip;
    public audio: any;

    protected background: Phaser.GameObjects.TileSprite;
    protected stars: any//ScrollingBackground[];
    protected particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    protected playerKeys: MultyKeys;
    protected animationConfig: any;


    constructor() {
        super({ key: SceneKeys.GAME_SCENE });
        this.audio = {};

        this.animationConfig = AnimationConfig.list;
    }

    create(): void {
        const { W, A, D, S, SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.playerKeys = new MultyKeys(this, { up: W, left: A, down: S, right: D, fire: SPACE });
        this.asteroidGroup = this.add.group();
        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerLasers = this.add.group();
        this.powerUps = this.add.group();
        this.time.addEvent({ delay: 500, callback: () => this.spawnEnemy(), callbackScope: this });

        const len: number = this.animationConfig.length;
        for (let i = 0; i < len; i++) {
            let texture: any = this.animationConfig[i];
            if (this.textures.list.hasOwnProperty(texture.key))
                continue;

            this.textures.addSpriteSheetFromAtlas(texture.key, {
                atlas: texture.atlas,
                frame: texture.frame,
                frameWidth: texture.frameWidth
            });
            this.anims.create({
                key: texture.animKey,
                frames: this.anims.generateFrameNumbers(texture.key, { start: texture.start, end: texture.end }),
                frameRate: 20,
                repeat: -1
            });
        }
        this.background = this.add.tileSprite(0, 0, 2540, 1480, TextureKeys.BACKGORUND).setOrigin(0).setScrollFactor(0);
        //Planets
        //todo , this planets should be placed randomly all the time , when the player flies over the space
        this.add.image(512, 680, TextureKeys.SPACE, TextureKeys.BLUE_PLANET).setOrigin(0).setScrollFactor(0.6);
        this.add.image(2833, 1246, TextureKeys.SPACE, TextureKeys.BROWN_PLANET).setOrigin(0).setScrollFactor(0.6);
        this.add.image(3875, 531, TextureKeys.SPACE, TextureKeys.SUN).setOrigin(0).setScrollFactor(0.6);
        this.add.image(5345 + 1024, 327 + 1024, TextureKeys.SPACE, TextureKeys.GALAXY).setBlendMode(1).setScrollFactor(0.6);
        this.add.image(908, 3922, TextureKeys.SPACE, TextureKeys.GAS_GIANT).setOrigin(0).setScrollFactor(0.6);
        this.add.image(3140, 2974, TextureKeys.SPACE, TextureKeys.BROWN_PLANET).setOrigin(0).setScrollFactor(0.6);
        this.add.image(6052, 4280, TextureKeys.SPACE, TextureKeys.PURPLE_PLANET).setOrigin(0).setScrollFactor(0.6);

        for (var i = 0; i < 8; i++) {
            this.add.image(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), TextureKeys.SPACE, 'eyes').setBlendMode(1);
        }
        this.stars = this.add.tileSprite(400, 300, 1024, 1024, TextureKeys.STARS).setScrollFactor(0);
        //Audio
        this.audio.collect = this.sound.add(SoundKeys.COLLECT);
        this.audio.explosion = this.sound.add(SoundKeys.EXPLOSION);
        this.audio.laser = this.sound.add(SoundKeys.LASER);
        this.audio.asteroidExplosion = this.sound.add(SoundKeys.ASTEROID_EXPLOSION);
        //ship
        this.playerShip = this.createPlayerShip();

        this.stars = [];
        for (let i = 0; i < 5; i++) {
            const bg = new ScrollingBackground(this, TextureKeys.STARS, -100);
            this.stars.push(bg);
        }
        this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser: PlayerLaser, enemy: Ship) => {
            if (enemy) {
                enemy.onDestroy();
                this.audio.asteroidExplosion.play();
            }
            playerLaser.onDestroy();
        });
        this.physics.add.overlap(this.playerShip, this.enemies, (player: PlayerShip, enemy: Ship) => {
            if (!player.getData("isDead") && !enemy.getData("isDead")) {
                this.audio.explosion.play();
                player.onDestroy();
                enemy.onDestroy();
            }
        });
        this.physics.add.overlap(this.playerShip, this.enemyLasers, (player: PlayerShip, laser: EnemyLaser) => {
            if (!player.getData("isDead") && !laser.getData("isDead")) {
                this.audio.explosion.play();
                player.onDestroy();
                laser.onDestroy();
            }
        })
        this.physics.add.overlap(this.playerShip, this.powerUps, (player: PlayerShip, powerUp: PowerUp) => {
            if (!player.getData("isDead") && !powerUp.getData("isDead")) {
                const power: string = powerUp.getData("type");
                switch (power) {
                    case ComponentKeys.POWER_UP_LIFE:
                        PlayerModel.increaseLifes(1);
                        break;
                    case ComponentKeys.POWER_UP_SHIELD:
                        PlayerModel.setShield()
                        break;
                    case ComponentKeys.POWER_UP_BULLET:
                        PlayerModel.setBullet('laser');
                        break;
                    default:
                        console.log('New Power: ', power);//TODO: delete
                        break;
                }
                powerUp.onDestroy();
            }
        })
        // this.spawnAsteroids(20);
    }

    protected createPlayerShip(): PlayerShip {
        const playerShip = new PlayerShip(this, +this.game.config.width * 0.1, +this.game.config.height * 0.5, TextureKeys.SPACE, TextureKeys.SHIP,
            { texture: TextureKeys.SPACE, frame: TextureKeys.BLASTWAVE },
            { texture: TextureKeys.SPACE, frame: TextureKeys.BLASTER });

        //Ship Blue Fire Emitter
        const emitConfig: any = {
            frame: 'blue',
            speed: 100,
            lifespan: {
                onEmit: function (particle, key, t, value) {
                    return Phaser.Math.Percent(100, 0, 300) * 2000;
                }
            },
            alpha: {
                onEmit: function (particle, key, t, value) {
                    return Phaser.Math.Percent(100, 0, 300);
                }
            },
            angle: {
                onEmit: function (particle, key, t, value) {
                    var v = Phaser.Math.Between(-10, 10);
                    return (playerShip.angle - 180) + v;
                }
            },
            scale: { start: 0.6, end: 0 }, blendMode: 'ADD'
        };

        this.particles = this.add.particles(TextureKeys.SPACE);
        let emitter = this.particles.createEmitter(emitConfig);
        emitter.startFollow(this.playerShip);

        return playerShip;
    }

    protected spawnEnemy() {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                let enemy: Ship;
                if (Phaser.Math.Between(0, 10) >= 3) {
                    enemy = new GunShip(this, Phaser.Math.Between(0, +this.game.config.width), 0, "enemyShips", "ship2_1.png", null,
                        { texture: TextureKeys.LASERS, frame: TextureKeys.LASER_RED1 });
                } else if (Phaser.Math.Between(0, 10) >= 5) {
                    enemy = new ChaserShip(this, Phaser.Math.Between(0, +this.game.config.width), 0, "enemyShips", "ship3_1.png", null,
                        { texture: TextureKeys.LASERS, frame: TextureKeys.LASER_RED3 });
                } else {
                    enemy = new CarrierShip(this, Phaser.Math.Between(0, +this.game.config.width), 0, "enemyShips", "ship1_1.png",
                        { texture: TextureKeys.LASERS, frame: TextureKeys.LASER_RED3 });
                }
                enemy.setScale(0.5);
                this.enemies.add(enemy);
            },
            callbackScope: this,
            loop: true
        })
    }

    protected getEnemiesByType(type: string) {
        const enemies: Ship[] = [];
        this.enemies.getChildren().forEach((enemy: Ship) => {
            if (enemy.getData("type") == type) {
                enemies.push(enemy)
            }
        })
    }

    protected asteroidIsShoot(bullet: Bullet, asteroid: Asteroid): void {
        this.audio.asteroidExplosion.play();
        bullet.onDestroy();
        asteroid.isShoot = true;
        MenuScene.SCORE += (asteroid.getScore * GameScene.LEVEL);
        asteroid.dispose();
        // this.spawnAsteroids(1);
    }

    // private spawnAsteroids(amount: number): void {
    //     for (let i = 0; i < amount; i++) {
    //         const x: number = this.getRandomSpawnPostion(this.sys.canvas.width) + this.playerShip.x;
    //         const y: number = this.getRandomSpawnPostion(this.sys.canvas.height) + this.playerShip.y;
    //         const num: number = Phaser.Math.RND.between(1, 4);
    //         const texture: string = TextureKeys.ASTEROID + num + '-anim';
    //         const asteroid = new Asteroid(this, x, y, texture, this.playerShip, {
    //             texture: TextureKeys.SPACE,
    //             frame: TextureKeys.ASTEROID_FLASH
    //         });

    //         asteroid.play(texture);
    //         asteroid.setBodySize(asteroid.width, asteroid.height);
    //         this.asteroidGroup.add(asteroid);
    //     }
    // }

    private getRandomSpawnPostion(aScreenSize: number): number {
        let rndPos = Phaser.Math.RND.between(aScreenSize / 2, aScreenSize);

        while (rndPos > aScreenSize / 3 && rndPos < aScreenSize * 2 / 3)
            rndPos = Phaser.Math.RND.between(aScreenSize / 2, aScreenSize);

        return Phaser.Math.RND.between(0, 1) ? rndPos : -rndPos;
    }

    update(time, delta): void {
        this.background.tilePositionY -= 0.5;

        if (this.playerShip && !this.playerShip.getData("isDead")) {
            this.playerShip.update();
            if (this.playerKeys.up.isDown) {
                this.playerShip.moveUp()
            } else if (this.playerKeys.down.isDown) {
                this.playerShip.moveDown()
            }

            if (this.playerKeys.right.isDown) {
                this.playerShip.moveForward()
            } else if (this.playerKeys.left.isDown) {
                this.playerShip.moveBackward()
            }

            if (this.playerKeys.fire.isDown) {
                this.playerShip.setData(PlayerKeys.IS_SHOOTING, true);
            } else {
                this.playerShip.setData(PlayerKeys.IS_SHOOTING, false);
                this.playerShip.setData(PlayerKeys.TIMER_SHOOT_TICK, this.playerShip.getData(PlayerKeys.TIMER_SHOOT_DELAY));
            }
        }

        this.enemies.getChildren().forEach((enemy: Ship) => {
            enemy.update();
            if (enemy.x < -enemy.displayWidth || enemy.x > +this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 || enemy.y > +this.game.config.height + enemy.displayHeight) {
                enemy.onDestroy();
            }
        });
        this.enemyLasers.getChildren().forEach((laser: EnemyLaser) => {
            laser.update();
            if (laser.x < -laser.displayWidth || laser.x > +this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 || laser.y > +this.game.config.height + laser.displayHeight) {
                laser.onDestroy();
            }
        });
        this.playerLasers.getChildren().forEach((laser: PlayerLaser) => {
            laser.update();
            if (laser.x < -laser.displayWidth || laser.x > +this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 || laser.y > +this.game.config.height + laser.displayHeight) {
                laser.onDestroy();
            }
        });

        if (this.playerShip && this.playerShip.getData("isDead") && this.playerShip.getData(PlayerKeys.IS_EXPLOSION_COMPLETE)) {

            this.playerShip.destroy();

            if (PlayerModel.hasMoreLifes()) {
                PlayerModel.decreaseLifes();
                this.playerShip = this.createPlayerShip();
            } else {
                this.playerLasers.destroy(true);
                this.enemyLasers.destroy(true);
                this.enemies.destroy(true);
                // this.asteroidGroup.destroy(true);
                this.scene.start("MenuScene");
            }

        }
    }
}
