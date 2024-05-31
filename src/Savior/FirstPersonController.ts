import { Scene, Engine, SceneLoader, Vector3, HemisphericLight, FreeCamera, Sound, Mesh, AbstractMesh, TransformNode, MeshBuilder, StandardMaterial, Texture, Color3, Material, Animation, Matrix, PBRMaterial, CubeTexture, Quaternion, Ray, EasingFunction, CubicEase, PhysicsImpostor, ColorGradient, Color4, Tags, CannonJSPlugin, SceneOptimizerOptions, SceneOptimizer, HardwareScalingOptimization } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, Button, Rectangle, Control, LinearGradient } from "@babylonjs/gui";

import "@babylonjs/loaders";

import { Level } from "./Level";
import { Weapon } from "./Weapon";

import { Enemy } from "./Enemy";
import { Player } from "./Player";

import { AmmoPickup } from "./AmmoPickup";

import { FirstAidPickup } from "./FirstAidPickup";
import { WeaponPickups } from "./WeaponPickups";

import { UI } from "./UI";
import { Mutant } from "./Mutant";
import { Warrok } from "./Warrok";



import { M60 } from "./M60";
import { Pistol } from "./Pistol";
import { Minigun } from "./Minigun";

import { TorchPowerup } from "./TorchPowerup";

export class FirstPersonController {
    scene: Scene;
    engine: Engine;
    weapon!: Weapon;
    inventory!: Weapon[];
    currentWeaponIndex!: number;
    camera!: FreeCamera;
    level: Level;
    isJumping!: boolean;
    wantToJump!: boolean;
    isMoving!: boolean;
    //bulletHoleMaterial!: PBRMaterial;
    isSprinting: boolean;

    ui: UI;

    enemies: Enemy[];
    player: Player;

    playerBox: any;
    ground: any;

    //ammoBoxSound: Sound;
    //firstAidSound: Sound;
    outOfBreathSound: Sound;
    

    jumpSpeed: number;
    jumpHeight: number;
    jumpPeak: number;

    minigun!: Minigun;
    pistol!: Pistol;
    rifle!: Weapon;


    ammopickup: AmmoPickup;
    firstaid: FirstAidPickup;
    weaponPickups: WeaponPickups;
    lmg: M60;
    torchPowerup: TorchPowerup;

    canReload!: boolean;

    isPaused!: boolean;
    

    constructor(private canvas: HTMLCanvasElement) {

        
        
      this.engine = new Engine(this.canvas, true);
     
      this.level = new Level(this.engine, this);
      this.scene = this.level.scene;

      this.canReload = true;
      this.isPaused = false;

   /*    const optimizerOptions = new SceneOptimizerOptions(
        
    );

    optimizerOptions.addOptimization(new HardwareScalingOptimization(0,1));
    
    
    SceneOptimizer.OptimizeAsync(this.scene, optimizerOptions); */
    
      
       
            this.outOfBreathSound = new Sound(
                "outOfBreath",
                "./audio/player/outofbreath.mp3",
                this.scene,
                null,
                {
                    //spatialSound:true,
                    volume: 1,
                    autoplay:false
                });


                

      this.isSprinting = false;
      this.isJumping = false;
      this.isMoving = false;
      this.jumpSpeed = 0.1; 
      this.jumpHeight = 2; 
      this.jumpPeak = 0; 
 
      this.enemies = [];
      this.inventory = [];

      this.ammopickup = this.level.ammopickup;
      this.firstaid = this.level.firstaid;

     
      this.CreateController();
      
      this.CreateImpostors();
      this.player = new Player(this.camera, this.scene, this);
   

      /* this.level.startWaveSystem(); */
   


      this.minigun = new Minigun(this.scene, this.camera, this.enemies, this.player, this.canvas);
      this.pistol = new Pistol(this.scene, this.camera, this.enemies, this.player, this.canvas);
      this.rifle = new Weapon(this.scene, this.camera, this.enemies, this.player, this.canvas);
      this.lmg = new M60(this.scene, this.camera, this.enemies, this.player, this.canvas);

      this.lmg.preloadMesh();
      this.minigun.preloadMesh();
      this.rifle.preloadMesh();

      this.weapon = this.pistol;

      this.inventory.push(this.weapon);


 


     /*  this.inventory.push(new Weapon(this.scene, this.camera, this.enemies));
      this.inventory.push(new Pistol(this.scene, this.camera, this.enemies));
      this.inventory.push(new Minigun(this.scene, this.camera, this.enemies)); */
      this.currentWeaponIndex = 0;


        // Preload meshes for all weapons in the inventory
        this.inventory.forEach((weapon, index) => {
            if(weapon !== this.weapon) {
                weapon.preloadMesh();
            }
        });

      
      
       

     
      this.weapon.CreateG();
  
  
      this.setupInput();
      this.loadFootsteps();
  

      //this.loadText();

      this.ui = new UI(this.player, this.weapon, this.inventory, this.currentWeaponIndex, this.level);
      this.ui.unpauseButton.onPointerClickObservable.add(() => {
        this.togglePause();
        
    });

      //this.switchWeapon(this.currentWeaponIndex);

/*         
        this.ammopickup.CreateAmmoPickup(new Vector3(95,0,-76));

        
        this.firstaid.CreateFirstAidPickup(new Vector3(100,0,-86)); */


      this.weaponPickups = this.level.weaponPickups;
    /*   this.weaponPickups.CreateMinigunPickup(new Vector3(90,0,-75));
      this.weaponPickups.CreatePistolPickup(new Vector3(100,0,-75));
      this.weaponPickups.CreateRiflePickup(new Vector3(110,0,-75));
      this.weaponPickups.CreateLMGPickup(new Vector3(120,0,-75)); */


      this.torchPowerup = new TorchPowerup(this.scene);

      this.torchPowerup.CreateTorchPowerup(new Vector3(-30, 0, 40));

      

      let isShooting = false;

this.scene.onPointerDown = (evt) => {
    if (!this.engine.isPointerLock && evt.button === 0) {
        this.engine.enterPointerlock();
        Engine.audioEngine?.unlock();
    } else if (evt.button === 0 && !this.player.isDead() && !this.weapon.isReloading) {
        if (this.weapon.toggleAutomatic) {
            isShooting = true;
            this.canReload = false;
            shootLoop();
        } else {
            shootOnce();
        }
    }
};

this.scene.onPointerUp = (evt) => {
    if (evt.button === 0) {
        isShooting = false;
        this.canReload =  true;
    }
};

let lastShotTime = 0;



const shootOnce = () => {
    if (this.weapon.ammo > 0) {
        this.weapon.shoot();
       

        if(this.weapon === this.minigun) { 
            

            if(this.weapon.isReadying) {
                this.weapon.animationGroups.forEach(function (animationGroup) {
                    animationGroup.stop();
                });

                this.weapon.isReadying = false;

            }

                this.weapon.shootAnimation(this.weapon);
            
            this.minigun.muzzleAnimation(this.weapon); 
            
        }


        else {
            this.weapon.shootAnimation(this.weapon);
        }


    } else {
        this.weapon.emptySound.play();
    }
};



const shootLoop = () => {
    const currentTime = performance.now(); 
    if (isShooting && this.weapon.toggleAutomatic) {
        if (this.weapon.ammo > 0 && currentTime - lastShotTime >= this.weapon.fireRate) {
            shootOnce();
            lastShotTime = currentTime;
        } else if (this.weapon.ammo <= 0) {
            isShooting = false;
            this.weapon.emptySound.play();
        }
    }
    requestAnimationFrame(shootLoop);
};


requestAnimationFrame(shootLoop);





this.scene.onDataLoadedObservable.addOnce(() => {
    
    this.camera.needMoveForGravity = true;
    this.engine.hideLoadingUI();
    this.level.startWaveSystem();
});

      
      
    this.scene.registerBeforeRender(() => {
  
        for (const enemy of this.enemies) {
          
            enemy.move(this.player); 
            
        }

 
       if(this.playerBox.position.y+1 > 1.56) {
        this.camera.position.y = this.playerBox.position.y+1;
       }
        this.playerBox.position.z = this.camera.position.z;
        this.playerBox.position.x = this.camera.position.x;

        

        if(this.camera.position.y <= 1.56) {
            this.isJumping = false;
        }

        if(this.playerBox.position.y < 0) {
            this.playerBox.position.y = 0.57; // try reset to fix bug
        }
    });


    

      this.engine.runRenderLoop(() => {

        if (this.isPaused) {
            this.ui.showPauseScreen();
            return; 
        }
   
        this.player.updatePosition(this.camera);

          

           
            this.ui.updateAmmoText();
            this.ui.updatePlayerHP();
            this.ui.updateStaminaText();
            this.ui.updatePlayerScore();
            this.ui.updateWaveNumber();
            this.ui.updateWaveTimer();


            if(this.player.health <= 0) {
                this.camera.position.y = 0.3;

                this.weapon.animationGroups.forEach(function (animationGroup) {
                    animationGroup.stop();
                });
                 
                this.camera.detachControl();
                this.engine.exitPointerlock();
                this.ui.createDeathScreen();
            }



            if(this.isSprinting && this.player.stamina > 0) {
                this.camera.speed = this.player.sprintSpeed;
            }
            if(!this.isSprinting || this.player.stamina <=0 ) {
                this.camera.speed = this.player.walkSpeed;
            }

        
         
        this.scene.render();
        
      });
  
  
  
      
    }
  
  
  
    CreateController(): void {
      const camera = new FreeCamera("camera", new Vector3(-35, 15, 55), this.scene);
      camera.setTarget(new Vector3(0,1.5,-2));
      camera.attachControl();
      camera.applyGravity = true;
      camera.checkCollisions = true;
      camera.ellipsoid = new Vector3(1, 0.75, 1);
      camera.minZ = 0;
  
      camera.speed = 1.2;
      camera.angularSensibility = 800;
      
      camera.keysUp.push(90);
      camera.keysUp.push(87);

      camera.keysDown.push(83);

      camera.keysLeft.push(81);
      camera.keysLeft.push(65);

      camera.keysRight.push(68);
        
      camera.inertia = 0.1;



     

  
      this.camera = camera;

      
     
      camera.onCollide = (collidedMesh) => {
        switch (collidedMesh.id) {
            case 'ammoBox':
                this.ammopickup.pickupSound.play();
                this.weapon.reloadAmmo += 120;
                this.weapon.reloadWeapon();
                collidedMesh.dispose();
                break;
    
            case 'firstAid':
                this.firstaid.pickupSound.play();
                this.player.health = this.player.maxHealth;
                collidedMesh.dispose();
                break;
    
            case 'minigunPickup':
                this.weaponPickups.pickupSound.play();
                if (!this.inventory.includes(this.minigun)) {
                    this.inventory.push(this.minigun);
                } else {
                    this.minigun.reloadAmmo += 180;
                }
                collidedMesh.dispose();
                break;
    
            case 'pistolPickup':
                this.weaponPickups.pickupSound.play();
                if (!this.inventory.includes(this.pistol)) {
                    this.inventory.push(this.pistol);
                } else {
                    this.pistol.reloadAmmo += 60;
                }
                collidedMesh.dispose();
                break;
    
            case 'riflePickup':
                this.weaponPickups.pickupSound.play();
                if (!this.inventory.includes(this.rifle)) {
                    this.inventory.push(this.rifle);
                } else {
                    this.rifle.reloadAmmo += 60;
                }
                collidedMesh.dispose();
                break;
    
            case 'lmgPickup':
                this.weaponPickups.pickupSound.play();
                if (!this.inventory.includes(this.lmg)) {
                    this.inventory.push(this.lmg);
                } else {
                    this.lmg.reloadAmmo += 120;
                }
                collidedMesh.dispose();
                break;
    
            case 'torchPowerup':
                this.torchPowerup.pickupSound.play();
                this.rifle.damage += 4;
                this.pistol.damage += 2;
                this.minigun.damage += 6;
                this.lmg.damage += 6;
    
                this.player.score += this.level.torchPowerup.scoreValue;
    
                if (this.player.jumpingPower < 12) {
                    this.player.jumpingPower += 1;
                }
    
                if (this.player.staminaDecayRate > 2) {
                    this.player.staminaDecayRate -= 1;
                }
    
                if (this.player.staminaRegenRate < 10) {
                    this.player.staminaRegenRate += 1;
                }
    
                collidedMesh.dispose();
                break;
    
            case 'medalPowerup':
                this.torchPowerup.pickupSound.play();
                if (this.player.sprintSpeed < 7) {
                    this.player.sprintSpeed += 0.25;
                }
    
                this.player.score += this.level.medalPowerup.scoreValue;
                collidedMesh.dispose();
                break;
    
            default:
                
                break;
        }
    }
    





    
      
    

      
      }
  
      

      
     
      
        











    setupInput(): void {

        const pressedKeys: { [key: string]: boolean } = {
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false,
            ShiftLeft: false,
            ShiftRight: false
        };



         
         document.addEventListener('keydown', (event) => {
             if (event.code === 'KeyW' || event.code === 'KeyA' || event.code === 'KeyS' || event.code === 'KeyD') {
                
                 this.isMoving = true;
                 pressedKeys[event.code] = true;
             }

             if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && this.isMoving) {
                
                 this.isSprinting = true;
                 if(this.player.stamina > 0) {
                     this.camera.speed = this.player.sprintSpeed;
                 }
                 else {
                     this.camera.speed = this.player.walkSpeed;
                 }
                 this.player.decayStamina();
             }


              
                    switch (event.code) {
                        case 'Digit1':
                            this.switchWeaponByKey(0);
                            break;
                        case 'Digit2':
                            this.switchWeaponByKey(1);
                            break;
                        case 'Digit3':
                            this.switchWeaponByKey(2);
                            break;
                        case 'Digit4':
                            event.preventDefault(); // default 4 on firefox
                            this.switchWeaponByKey(3);
                            break;

                        case 'Digit9':
                            this.toggleGodMode();
                            break;


                       /*  case 'Digit8': 
                            event.preventDefault();
                            this.togglePause();
                            break; */
                    }
         });

         
         document.addEventListener('keyup', (event) => {
             if (event.code === 'KeyW' || event.code === 'KeyA' || event.code === 'KeyS' || event.code === 'KeyD') {
                 
                 pressedKeys[event.code] = false;
                 if (!pressedKeys['KeyW'] && !pressedKeys['KeyA'] && !pressedKeys['KeyS'] && !pressedKeys['KeyD']) {
                     this.isMoving = false;
                 }
             }

             if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                 
                 this.isSprinting = false;
                 this.camera.speed = this.player.walkSpeed;
                 this.player.regenStamina();
             }
         });



     window.addEventListener('keydown', (event) => {
      

         if (event.code === 'Space' && !this.isJumping) {         
                event.preventDefault();     
                 this.jump();
                 this.isJumping = true;
         }
        
         if (event.code === 'KeyR') {
             if (this.weapon.reloadAmmo > 0 && !this.weapon.isReloading && this.canReload) {
                 this.weapon.reloadAnimation(this.weapon);
                 this.weapon.reloadWeapon();
                 
                 this.weapon.reloadSound.play();
             }
         }
        
        if(event.code === 'KeyH') {
            console.log("PLAYERBOX: ", this.playerBox.position.y);
           
      
            
        }

        
        
        });

    

    


     window.addEventListener('wheel', (event) => {
        
         if (event.deltaY < 0) {
             
             this.cycleWeapon(1);
         } else if (event.deltaY > 0) {
            
             this.cycleWeapon(-1);
         }
     });
 

       
    }
    
    
    jump(): void {
       

        if(!this.isJumping && !this.player.isDead()) {
            this.playerBox.physicsImpostor.applyImpulse(new Vector3(0,this.player.jumpingPower,0), this.playerBox.getAbsolutePosition());
            
        }
    }
    


    

        loadFootsteps(): void {

            const footstepsSound = new Sound(
                "footstepsSound",
                "./audio/footsteps.mp3",
                this.scene,
                null,
                {
                    volume: 1, 
                    loop: true 
                }
            );
        
            const startFootsteps = () => {
                if (!footstepsSound.isPlaying) {
                    footstepsSound.play();
                }
            };
        
           
            const stopFootsteps = () => {
                if (footstepsSound.isPlaying) {
                    footstepsSound.stop();
                }
            };
        
            
            this.scene.onBeforeRenderObservable.add(() => {
                if (this.isMoving && !this.player.isDead() && !this.isJumping) {
                    startFootsteps();
                  
                } else {
                    stopFootsteps();
                 
                }
            });


           
        }





        loadBreathing() {
            const outOfBreath = new Sound(
                "firstAidPickup",
                "./audio/player/outofbreath.mp3",
                this.scene,
                null,
                {
                    spatialSound:true,
                    volume: 1,
                    autoplay:false
                });

                if(this.player.stamina == 0) {
                    outOfBreath.play();
                }

        }


    

        CreateImpostors(): void {

                       
                this.playerBox = MeshBuilder.CreateSphere("playerBox", { diameter: 1}, this.scene);
                this.playerBox.position.x = this.camera.position.x; 

                this.playerBox.position.z = this.camera.position.z;
                this.playerBox.position.y = 0.055+0.5;

                this.playerBox.isVisible = false;
               
                this.playerBox.isPickable = false;
                
               
                this.playerBox.physicsImpostor = new PhysicsImpostor(
                    this.playerBox,
                    PhysicsImpostor.SphereImpostor,
                    { mass: 1, restitution: 0, friction: 0 },
                    this.scene
                );


                 this.playerBox.physicsImpostor.registerOnPhysicsCollide(
                    this.ground.physicsImpostor,
                    this.isNotJumping
                ); 
        } 




        isNotJumping(): void {
            this.isJumping = false;
        }






        cycleWeapon(direction: number): void {
           
            if (this.inventory.length === 1) {
                return;
            }
        
         
            this.currentWeaponIndex += direction;
        
           
            if (this.currentWeaponIndex < 0) {
                this.currentWeaponIndex = this.inventory.length - 1;
            } else if (this.currentWeaponIndex >= this.inventory.length) {
                this.currentWeaponIndex = 0;
            }
        
           
          
            this.switchWeapon(this.currentWeaponIndex);
        }
        
        switchWeapon(index: number): void {
          
            if (index >= 0 && index < this.inventory.length) {
              
                if (this.weapon && this.weapon.isMeshCreated && this.weapon.gunMesh) {
                    this.weapon.gunMesh.setEnabled(false);
                }
                
              
                this.weapon = this.inventory[index];
                this.weapon.readyAnimation(this.weapon);
                this.weapon.readySfx();

                this.ui.weapon = this.weapon;
                this.ui.updateAmmoText();
        
               
                if (!this.weapon.isMeshCreated) {
                    this.weapon.CreateG(); 
                }
        
             
                if (this.weapon && this.weapon.isMeshCreated && this.weapon.gunMesh) {
                    this.weapon.gunMesh.setEnabled(true);
                }


                this.currentWeaponIndex = index;
        
            }
        
        
        }
        

        applyShockwave() {
            const originalCameraSpeed = this.camera.speed;
            this.camera.speed = this.camera.speed*0.5;
            setTimeout(() => {
                this.camera.speed = originalCameraSpeed;
                /* this.camera.speed = originalCameraSpeed; */
            }, 6000);

        }



        switchWeaponByKey(index: number): void {
            if(index === this.currentWeaponIndex) { return; }

            if (index >= 0 && index < this.inventory.length /* && index !== this.currentWeaponIndex */) {
                this.switchWeapon(index);
            }
        }




        toggleGodMode() {
            this.player.maxHealth = 9000;
            this.player.health = 9000;

            this.player.staminaDecayRate = 0;
            this.player.staminaRegenRate = 20;

            this.player.sprintSpeed = 7;
            this.player.jumpingPower = 12;

            /* this.pistol.damage = 1000;
            this.rifle.damage = 1000;
            this.lmg.damage = 1000;
            this.minigun.damage = 1000; */


            this.inventory.push(this.rifle);
            this.inventory.push(this.lmg);
            this.inventory.push(this.minigun);

            
        }


        togglePause(): void {
            
    
            if (this.isPaused) {

                this.ui.showPauseScreen();
               
                this.camera.detachControl();
  
                


            } else {
                this.ui.hidePauseScreen();
               
                this.camera.attachControl();
                
            }
        }

}