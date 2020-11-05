class PlayerModel {
    protected score: number = 0;
    protected hightScore: number = 0;
    protected level: number = 0;
    protected maxLevels: number = 3;
    protected lifes: number = 1;
    protected shiled: boolean = false;
    protected bullet: 'normal' | 'laser' | 'spread' | 'bigBullet';
    protected bfg: number = 2;

    public updateScore(score: number): void {
        this.score += score;
    }
    public updateHighScore(): void {
        if (this.score > this.hightScore) {
            this.hightScore = this.score
        }
    }
    public respaln(): boolean {
        if (this.lifes > 0) {
            this.lifes -= 1;
            return true;
        } else {
            return false;
        }
    }
    public increaseLifes(bonusLife: number) {
        this.lifes += bonusLife;
    }
    public decreaseLifes(): void {
        this.lifes -= 1;
    }
    public hasMoreLifes(): boolean {
        return this.lifes <= 0 ? false : true;
    }
    public isShieldActive(): boolean {
        return this.shiled;
    }
    public setShield(): void {
        this.shiled = true;
    }
    public setBullet(bulet: 'normal' | 'laser' | 'spread' | 'bigBullet') {
        this.bullet = bulet;
    }
    public increaseLevel(): boolean {
        if (this.level < this.maxLevels) {
            this.level += 1;
            return true;
        } else {
            return false;
        }
    }

    public crealStats():void {
        this.shiled  = false;
        this.bullet = 'normal';
        this.bfg = 2;
    }
}

export default new PlayerModel()