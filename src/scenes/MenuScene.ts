import SceneKeys from "../const/SceneKeys";

export default class MenuScene extends Phaser.Scene {
    static SCORE: number = 0;
    static HIGH_SCORE: number = 0;
    private background: Phaser.GameObjects.TileSprite;
    public config: any;

    constructor() {
        super({ key: SceneKeys.MENU_SCENE });
    }

    create(): void {
        if (MenuScene.SCORE > MenuScene.HIGH_SCORE)
            MenuScene.HIGH_SCORE = MenuScene.SCORE;
        MenuScene.SCORE = 0;

        this.background = this.add.tileSprite(0, 0, this.sys.canvas.width, this.sys.canvas.height, 'background').setOrigin(0);

        let text = 'Tap to begin';
        let style = { font: "30px Arial", fill: "#fff", align: "center" };
        let field = this.add.text(0, 0, text, style);
        field.setPosition((this.sys.canvas.width / 2) - (field.width) / 2, (this.sys.canvas.height / 2) - (field.height) / 2);

        text = "Highest score: " + MenuScene.HIGH_SCORE;
        style = { font: "15px Arial", fill: "#fff", align: "center" };
        field = this.add.text(0, 0, text, style)
        field.setPosition((this.sys.canvas.width / 2) - (field.width) / 2, (this.sys.canvas.height / 2) - (field.height) / 2 + 50);
        console.log("MenuScene.HIGH_SCORE:", MenuScene.HIGH_SCORE); // TODO:remove
    }

    update(): void {
        if (this.input.activePointer.isDown) {
            this.scene.start('GameScene');
        }
        this.background.tilePositionY -= 0.5;
    }
}
