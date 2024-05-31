import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { Player } from "./Player";
import { Weapon } from "./Weapon";
import { Level } from "./Level";

export class UI {


    ammoTextBlock!: TextBlock;
    healthBlock!: TextBlock;
    staminaBlock!: TextBlock;
    player: Player;
    weapon: Weapon;
    healthBar!: Rectangle;
    staminaBar!: Rectangle;

    inventory!: Weapon[];
    currentWeaponIndex!: number;

    coordinatesBlock!: TextBlock;
    scoreBlock!: TextBlock;

    level: Level;

    waveBlock!: TextBlock;
    waveTimeBlock!: TextBlock;

    deathScreen!: Rectangle;
    restartButton!:Button;

    showDeathScreen: boolean;
    showWinScreen: boolean;
    winScreen: any;


    pauseMenu!: Rectangle;
    unpauseButton!: Button;

    constructor(player: Player, weapon: Weapon, inventory: Weapon[], currentWeaponIndex: number, level: Level) {
        this.player = player;
        this.weapon = weapon;
        
        this.inventory = inventory;
        this.currentWeaponIndex = currentWeaponIndex;
       
        this.showDeathScreen = false;
        this.showWinScreen = false;

        this.level = level;

        this.loadText();
        this.createPauseUI();
    }

    loadText(): void {
        // Create a GUI texture
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
        // Create container for ammo text
        const ammoContainer = new Rectangle();
        ammoContainer.width = "22%";
        ammoContainer.height = "15%";
        ammoContainer.background = "rgba(0, 0, 0, 0.45)"; // Semi-transparent black background
        ammoContainer.cornerRadius = 20; // Rounded corners
        ammoContainer.thickness = 2; // Border thickness
        ammoContainer.color = "white"; // Border color
        ammoContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        ammoContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        ammoContainer.top = "80%";
        ammoContainer.left = "20%";
    
     /*    // Add box shadow effect
        ammoContainer.shadowBlur = 20; // Blur radius
        ammoContainer.shadowOffsetX = 10; // Offset along X axis
        ammoContainer.shadowOffsetY = 10; // Offset along Y axis
        ammoContainer.shadowColor = "#000000"; // Shadow color
     */
        advancedTexture.addControl(ammoContainer);
    
        // Create a text block for ammo
        this.ammoTextBlock = new TextBlock();
        this.ammoTextBlock.color = "rgb(0, 255, 0)";
        this.ammoTextBlock.fontFamily = "Consolas";
        this.ammoTextBlock.fontWeight = "bold";
        this.ammoTextBlock.fontSize = "36vw"; 
        ammoContainer.addControl(this.ammoTextBlock);
    
        this.updateAmmoText();
    
        // Create container for player health text
        const healthContainer = new Rectangle();
        healthContainer.width = "15%";
        healthContainer.height = "15%";
        healthContainer.background = "rgba(0, 0, 0, 0.45)";
        healthContainer.cornerRadius = 20;
        healthContainer.thickness = 2;
        healthContainer.color = "white";
        healthContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        healthContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        healthContainer.top = "80%";
        healthContainer.left = "3%";
    
      /*   // Add box shadow effect
        healthContainer.shadowBlur = 10; // Blur radius
        healthContainer.shadowOffsetX = 5; // Offset along X axis
        healthContainer.shadowOffsetY = 5; // Offset along Y axis
        healthContainer.shadowColor = "#000000"; // Shadow color */
    
        advancedTexture.addControl(healthContainer);
    
        // Create a text block for player health
        this.healthBlock = new TextBlock();
        this.healthBlock.color = "rgb(0, 255, 0)";
        this.healthBlock.fontFamily = "Consolas";
        this.healthBlock.fontWeight = "bold";
        this.healthBlock.fontSize = "36vw"; // Decreased font size for better fit
      
        healthContainer.addControl(this.healthBlock);



     /* // Create a progress bar for player health
     this.healthBar = new Rectangle();
     this.healthBar.width = "290px";
     this.healthBar.height = "20px";
     this.healthBar.cornerRadius = 20;
     this.healthBar.background = this.healthBlock.color; // Red color for the bar
     this.healthBar.thickness = 1;
     this.healthBar.color = "darkgreen";
     this.healthBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
     this.healthBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
     this.healthBar.top = "70px";
     this.healthBar.left = "10px";
 
     // Add box shadow effect
     this.healthBar.shadowBlur = 5; // Blur radius
     this.healthBar.shadowOffsetX = 2; // Offset along X axis
     this.healthBar.shadowOffsetY = 2; // Offset along Y axis
     this.healthBar.shadowColor = "#000000"; // Shadow color
 
     advancedTexture.addControl(this.healthBar); */
 
        this.updatePlayerHP();




        // Create a container for stamina text
       /*  const staminaContainer = new Rectangle();
        staminaContainer.width = "200px";
        staminaContainer.height = "100px";
        staminaContainer.background = "rgba(0, 0, 0, 0.45)"; // Semi-transparent black background
        staminaContainer.cornerRadius = 20; // Rounded corners
        staminaContainer.thickness = 2; // Border thickness
        staminaContainer.color = "white"; // Border color
        staminaContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        staminaContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        staminaContainer.top = "1%";
        staminaContainer.left = "40%"; */
    
     /*    // Add box shadow effect
        staminaContainer.shadowBlur = 10; // Blur radius
        staminaContainer.shadowOffsetX = 5; // Offset along X axis
        staminaContainer.shadowOffsetY = 5; // Offset along Y axis
        staminaContainer.shadowColor = "#000000"; // Shadow color */
    
        //advancedTexture.addControl(staminaContainer);


         // Create a stamina progress bar
        this.staminaBar = new Rectangle();
        this.staminaBar.width = "350px"; // Initially full width
        this.staminaBar.height = "15px";
        this.staminaBar.cornerRadius = 20;
        this.staminaBar.thickness = 1;
        this.staminaBar.background = "cyan"; // Cyan color
        this.staminaBar.color = "black";
        this.staminaBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.staminaBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.staminaBar.top = "75%";
        this.staminaBar.left = "5%";

                // Add box shadow effect
        this.staminaBar.shadowBlur = 5; // Blur radius
        this.staminaBar.shadowOffsetX = 2; // Offset along X axis
        this.staminaBar.shadowOffsetY = 2; // Offset along Y axis
        this.staminaBar.shadowColor = "#000000"; // Shadow color
        
        advancedTexture.addControl(this.staminaBar);
     
      /*   // Create a text block for stamina
        this.staminaBlock = new TextBlock();
        this.staminaBlock.color = "cyan";
        this.staminaBlock.fontFamily = "Consolas";
        this.staminaBlock.fontWeight = "bold";
        this.staminaBlock.fontSize = 36; // Decreased font size for better fit
        staminaContainer.addControl(this.staminaBlock); */
    
        this.updateStaminaText();




                // Create a text block for player coordinates
       /*  this.coordinatesBlock = new TextBlock();
        this.coordinatesBlock.color = "white";
        this.coordinatesBlock.fontFamily = "Consolas";
        this.coordinatesBlock.fontWeight = "bold";
        this.coordinatesBlock.fontSize = 18; 
        this.coordinatesBlock.text = "(x, y, z): "; // Initial text
        this.coordinatesBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.coordinatesBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.coordinatesBlock.top = "20px";
        this.coordinatesBlock.left = "650px";

        advancedTexture.addControl(this.coordinatesBlock); */

        // Assuming you have access to the player's coordinates, update the text accordingly
        //this.updatePlayerCoordinates();





        
        const scoreContainer = new Rectangle();
        scoreContainer.width = "520px";
        scoreContainer.height = "90px";
        scoreContainer.background = "rgba(0, 0, 0, 0.45)"; 
        scoreContainer.cornerRadius = 20; 
        scoreContainer.thickness = 2; 
        scoreContainer.color = "white"; 
        scoreContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        scoreContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        scoreContainer.top = "1%";
        scoreContainer.left = "25%";

        advancedTexture.addControl(scoreContainer);




              
        this.scoreBlock = new TextBlock();
        this.scoreBlock.color = "rgb(0, 255, 0)";
        this.scoreBlock.fontFamily = "Consolas";
        this.scoreBlock.fontWeight = "bold";
        this.scoreBlock.fontSize = "18vw"; 
        this.scoreBlock.text = "Score: "; 
   this.scoreBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.scoreBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.scoreBlock.top = "53px";
        this.scoreBlock.left = "200px"; 

        scoreContainer.addControl(this.scoreBlock);


        this.waveBlock = new TextBlock();
        this.waveBlock.color = "rgb(0, 255, 0)";
        this.waveBlock.fontFamily = "Consolas";
        this.waveBlock.fontWeight = "bold";
        this.waveBlock.fontSize = 18; 
        this.waveBlock.text = "Wave: "; 
        this.waveBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.waveBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.waveBlock.top = "5px";
        this.waveBlock.left = "200px";

        scoreContainer.addControl(this.waveBlock);

        

        this.waveTimeBlock = new TextBlock();
        this.waveTimeBlock.color = "rgb(0, 255, 0)";
        this.waveTimeBlock.fontFamily = "Consolas";
        this.waveTimeBlock.fontWeight = "bold";
        this.waveTimeBlock.fontSize = 18; 
        this.waveTimeBlock.text = "Prochaine vague: "; 
        this.waveTimeBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.waveTimeBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.waveTimeBlock.top = "30px";
       this.waveTimeBlock.left = "120px";

        scoreContainer.addControl(this.waveTimeBlock);













        // Pause menu
        
    }
    
    createPauseUI(): void {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.pauseMenu = new Rectangle();
        this.pauseMenu.width = 0.5;
        this.pauseMenu.height = 0.5;
        this.pauseMenu.background = "black";
        this.pauseMenu.alpha = 0.8;
        this.pauseMenu.isVisible = false;
        advancedTexture.addControl(this.pauseMenu);

        const pauseText = new TextBlock();
        pauseText.text = "Paused";
        pauseText.color = "white";
        pauseText.fontSize = 40;
        this.pauseMenu.addControl(pauseText);

        this.unpauseButton = Button.CreateSimpleButton("unpauseButton", "Unpause");
        this.unpauseButton.width = "150px";
        this.unpauseButton.height = "50px";
        this.unpauseButton.color = "white";
        this.unpauseButton.background = "gray";
        this.unpauseButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.unpauseButton.top = "-10px";
        this.pauseMenu.addControl(this.unpauseButton);
    }

    showPauseScreen(): void {
        if (this.pauseMenu) {
            this.pauseMenu.isVisible = true;
        }
    }

    hidePauseScreen(): void {
        if (this.pauseMenu) {
            this.pauseMenu.isVisible = false;
        }
    }









    updateAmmoText(): void {
       
        this.ammoTextBlock.text = this.weapon.ammo.toString()+" | "+this.weapon.reloadAmmo.toString();
        //this.ammoTextBlock.text = this.inventory[this.currentWeaponIndex].ammo.toString()+" | "+this.inventory[this.currentWeaponIndex].reloadAmmo.toString();
    }

 
    updateHealthBar(healthBar: Rectangle): void {
        const healthPercentage = this.player.health / this.player.maxHealth;
        healthBar.width = `${healthPercentage * 290}px`; 
        healthBar.background = this.healthBlock.color;
    }

    updatePlayerHP(): void {
        const health = this.player.health;
        this.healthBlock.text = health.toString();
    
       
        let color = "";
        if (health > 50) {
            
            const red = Math.floor(255 - (health - 50) * 5.1); 
            const green = 255;
            color = `rgb(${red},${green},0)`;
        } else {
           
            const green = Math.floor((health * 5.1));
            const red = 255;
            color = `rgb(${red},${green},0)`;
        }
    
      
        this.healthBlock.color = color;
        //this.updateHealthBar(this.healthBar);
    }


    updateStaminaText(): void {
       
        //this.staminaBlock.text = this.player.stamina.toString();

         const staminaPercentage = this.player.stamina / this.player.maxStamina;
        this.staminaBar.width = `${staminaPercentage * 33}%`; 
    }
    

    // Function to update player coordinates text
/* updatePlayerCoordinates() {



    const playerX = 0;
    const playerY =0;
    const playerZ = 0;

    

    
    this.coordinatesBlock.text = `(x: ${this.player.position.x.toFixed(2)}, y: ${this.player.position.y.toFixed(2)}, z: ${this.player.position.z.toFixed(2)})`;
    
} */


updatePlayerScore() {
    this.scoreBlock.text = `Score: ${this.player.score}`;
}


updateWaveNumber() {
    this.waveBlock.text = `Vague: ${this.level.waveNumber}`;
}


updateWaveTimer() {
    this.waveTimeBlock.text = `Prochaine vague: ${this.level.nextWaveTime} secondes.`;
}



createDeathScreen(): void {
    if(!this.showDeathScreen) {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

   
    this.deathScreen = new Rectangle();
    this.deathScreen.width = "100%";
    this.deathScreen.height = "100%";
    this.deathScreen.background = "rgba(255, 0, 0, 0.5)"; 
    this.deathScreen.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.deathScreen.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(this.deathScreen);




    const youDiedText = new TextBlock();
    youDiedText.text = "Vous êtes mort";
    youDiedText.color = "white";
    youDiedText.fontSize = 32;
    youDiedText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    youDiedText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    youDiedText.top = "-100px"; // Adjust vertical position
    this.deathScreen.addControl(youDiedText);

  
    const scoreText = new TextBlock();
    scoreText.text = "Score: " + this.player.score;
    scoreText.color = "white";
    scoreText.fontSize = 24;
    scoreText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    scoreText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.top = "-50px"; // Adjust vertical position
    this.deathScreen.addControl(scoreText);




    
    this.restartButton = Button.CreateSimpleButton("restartButton", "Rejouer");
    this.restartButton.width = "200px";
    this.restartButton.height = "50px";
    this.restartButton.color = "white";
    this.restartButton.background = "black";
    this.restartButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.restartButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

   
    this.restartButton.onPointerUpObservable.add(() => {
       
        advancedTexture.removeControl(this.deathScreen);


        location.reload();
    
    });

    this.deathScreen.addControl(this.restartButton);
    this.showDeathScreen = true;

    this.level.stopWaveSystem();
}
}



createWinScreen() {
    if(!this.showWinScreen) {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    
    this.winScreen = new Rectangle();
    this.winScreen.width = "100%";
    this.winScreen.height = "100%";
    this.winScreen.background = "rgba(0, 255, 0, 0.5)"; 
    this.winScreen.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.winScreen.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(this.winScreen);

    const youWonText = new TextBlock();
    youWonText.text = "Vous avez gagné!";
    youWonText.color = "white";
    youWonText.fontSize = 32;
    youWonText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    youWonText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    youWonText.top = "-100px"; 
    this.winScreen.addControl(youWonText);
    
    const scoreText = new TextBlock();
    scoreText.text = "Score: " + this.player.score;
    scoreText.color = "white";
    scoreText.fontSize = 24;
    scoreText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    scoreText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.top = "-50px"; 
    this.winScreen.addControl(scoreText);




   
    this.restartButton = Button.CreateSimpleButton("restartButton", "Rejouer");
    this.restartButton.width = "200px";
    this.restartButton.height = "50px";
    this.restartButton.color = "white";
    this.restartButton.background = "black";
    this.restartButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.restartButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

  
    this.restartButton.onPointerUpObservable.add(() => {
       
        advancedTexture.removeControl(this.winScreen);


        location.reload();
    
    });

    this.winScreen.addControl(this.restartButton);
    this.showWinScreen = true;

    this.level.stopWaveSystem();

    }
}


}