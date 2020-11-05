import Entity from "./base/Entity";

export default class Asteroid extends Entity {

    private velocity: Phaser.Math.Vector2;
    private ship: Phaser.GameObjects.Sprite;
    private score: number;
    private explosionConfig: any;
    private shooted: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, ship: Phaser.GameObjects.Sprite, explosionConfig?: any) {
        super(scene, x, y, texture, "Asteroid");

        this.ship = ship;
        this.shooted = false;
        this.score = 10;
        this.explosionConfig = explosionConfig;
        this.velocity = this.getRandomVelocity(2, 6);
    }

    get getScore(): number {
        return this.score;
    }

    get isShoot(): boolean {
        return this.shooted;
    }

    set isShoot(shooted: boolean) {
        this.shooted = shooted;
    }

    private getRandomVelocity(aMin: number, aMax: number): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(Phaser.Math.RND.between(this.getRndNumber(aMin, aMax), this.getRndNumber(aMin, aMax)), Phaser.Math.RND.between(this.getRndNumber(aMin, aMax), this.getRndNumber(aMin, aMax)));
    }

    private getRndNumber(aMin: number, aMax: number): number {
        let num = Math.floor(Math.random() * aMax) + aMin;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return num;
    }

    update(): void {
        // this.applyForce();

        if (!this.getData("isDead"))
            this.checkIfOffScreen();
    }

    private checkIfOffScreen(): void {
        if (this.x > (this.scene.sys.canvas.width * 1.5) + this.ship.x ||
            this.x < this.ship.x - (this.scene.sys.canvas.width * 1.5)) {
            this.setData("isDead", true);
        }
    }

    dispose(): void {
        if (this.isShoot)
            this.createExplosion();

        this.shooted = false;
        this.explosionConfig = null;
        this.destroy();
    }

    private createExplosion(): void {
        let explosion: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.x, this.y, this.explosionConfig.texture, this.explosionConfig.frame).setScale(0.1);

        this.scene.tweens.add({
            targets: explosion,
            props: {
                scaleX: { value: 1, ease: 'Power1' },
                scaleY: { value: 1, ease: 'Power1' }
            },
            duration: 150,
            yoyo: true,
            repeat: 0,
            onCompleteScope: this,
            onComplete: () => {
                explosion.destroy();
            }
        })
    }

    // private applyForce(): void {
    //     this.x += this.velocity.x;
    //     this.y += this.velocity.y;
    // }

}