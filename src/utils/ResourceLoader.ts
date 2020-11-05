// import * as gameConfig from "../../game-config.json";
const gameConfig = require("../../game-config.json");

class ResourceLoader {

    load(scene: Phaser.Scene): void {
        const sceneName = scene.scene.key
        const resources = gameConfig.resources[sceneName]

        if (resources) {
            for (const el in resources) {
                resources[el].forEach(res => {
                    scene.load[el](...res)
                });
            }
        }

    }

}
export default new ResourceLoader();