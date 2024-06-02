import { AbstractMesh, Animation, AnimationGroup, Color3, FreeCamera, Material, Mesh, MeshBuilder, PBRMaterial, Ray, Scene, SceneLoader, Sound, StandardMaterial, Tags, Texture, TransformNode, Vector3, ParticleSystem, Color4 } from "@babylonjs/core";
import "@babylonjs/loaders";

import { Enemy } from "./Enemy";
import { Weapon } from "./Weapon";
import { Player } from "./Player";

export class Pistol extends Weapon {

    isFiring: boolean;
    isReloading: boolean;
    ammo: number;
    reloadAmmo: number;


    canFire!: boolean;
    currentFireRate: number;

    muzzleFlashParticleSystem: ParticleSystem | null = null;


    damage: number;
    


    constructor(scene: Scene, camera: FreeCamera, enemies: Enemy[], player: Player, canvas: HTMLCanvasElement) {
        super(scene, camera, enemies, player, canvas);
        this.scene.getEngine().displayLoadingUI();

        this.isFiring = false;
        this.isReloading = false;
        this.ammo = 12;
        this.reloadAmmo = 36;
     


        this.fireRate = 100;
        this.canFire = true;
        this.currentFireRate = 0;
        this.toggleAutomatic = false;


        this.damage = 10;
        
        this.loadBulletholes();
        
    }


    async CreateG(): Promise<void> {
        //const mesh = await SceneLoader.ImportMeshAsync('', './models/', 'rifle.glb');

        const {meshes, animationGroups} = await SceneLoader.ImportMeshAsync('', './models/', 'pistol.glb');

        this.gunMeshChild = meshes[1];
    
        // Create a new TransformNode to hold the gun meshes
        const transformNode = new TransformNode('glb');
        
        // Parent each mesh in the loaded model to the TransformNode
       
            meshes[0].parent = transformNode;
            meshes[0].isVisible = true;
            meshes[0].renderingGroupId = 100;
            this.gunMesh = meshes[0];


            const start = 190;
            const end = 250;
           
            this.animationGroups = animationGroups;
            animationGroups.forEach( (animationGroup) => {
                animationGroup.stop();
                //animationGroup.start(true, 0.1, 0, 10); // shoot
                
                animationGroup.start(true, 0.2, 436, 498);
                

               
            });











        
        // Parent the TransformNode to the camera
        transformNode.parent = this.camera;
        
        // Adjust the position of the gun relative to the camera
        transformNode.position.y -= 0.16;
        transformNode.position.z += 0.5;
        transformNode.position.x += 0.32;
        
        // Adjust the rotation of the gun
     
        // Adjust the scaling of the gun
        transformNode.scaling.set(0.01,0.01,0.01);
        // transformNode.scaling.set(0.5, 0.5, 0.5  ); // gun


        this.CreateCrosshair();


        
        this.shootSound = new Sound(
            "shootSound",
            "./audio/pistolshoot.mp3", // Chemin vers le fichier audio
            this.scene,
            null,
            {
                spatialSound: true,
                volume: 1,
                autoplay: false
            }
        );
        this.shootSound.attachToMesh(this.gunMesh);



        this.emptySound = new Sound(
            "emptySound",
            "./audio/empty.mp3", // Chemin vers le fichier audio
            this.scene,
            null,
            {
                spatialSound: true,
                volume: 1,
                autoplay: false
            }
        );
        this.emptySound.attachToMesh(this.gunMesh);



        this.reloadSound = new Sound(
            "reloadSound",
            "./audio/reload.mp3", // Chemin vers le fichier audio
            this.scene,
            null,
            {
                spatialSound: true,
                volume: 1,
                autoplay: false
            }
        );
        this.reloadSound.attachToMesh(this.gunMesh);

        this.readySound = new Sound(
            "reloadSound",
            "./audio/weapons/readyRifle.mp3", // Chemin vers le fichier audio
            this.scene,
            null,
            {
                spatialSound: true,
                volume: 1,
                autoplay: false
            }
        );
        this.readySound.attachToMesh(this.gunMesh);


        this.createMuzzleFlashParticleSystem();
        this.isMeshCreated = true;

        //this.scene.getEngine().hideLoadingUI();
    }



    CreateCrosshair(): Mesh {
        const size = 1;
        const plane = MeshBuilder.CreatePlane('crosshair',{size});
        // plane.position.x= -size/2;
        // plane.position.y= -size/2;
        const material = new StandardMaterial('crossHairMaterial',this.scene);
        plane.material = material;
        const texture = new Texture('./textures/crosshair.png', this.scene);
        material.diffuseTexture=texture;
        material.diffuseColor=Color3.White();
        material.opacityTexture = material.diffuseTexture
        material.transparencyMode = Material.MATERIAL_ALPHABLEND;
        material.alpha = 1
        texture.hasAlpha = true;
        plane.parent = this.camera;
        plane.position.z = 1;
        plane.scaling = new Vector3(0.3/4,0.3/4,0.3/4);
        plane.checkCollisions = false;
        plane.isPickable = false;
        return plane;
    }



    
    shootAnimation(gun: Weapon) {

       
        

        gun.isFiring = true;
        gun.animationGroups.forEach( (animationGroup) => {
            animationGroup.stop();
            animationGroup.start(false, 1, 0, 28);
    
        




        // Start the muzzle flash particle system when the shooting animation begins
        if (gun.muzzleFlashParticleSystem) {
            gun.muzzleFlashParticleSystem.start();
            setTimeout(() => {
                gun.muzzleFlashParticleSystem!.stop();
            }, 10); // Adjust duration of the muzzle flash

           /*  // Update the position of the particle system on each frame
            this.scene.onBeforeRenderObservable.add(() => {
                // Update the position of the particle system to match the position of the gun mesh
                this.muzzleFlashParticleSystem!.emitter = this.gunMesh;
            }); */
            
        }

        







            // Register a callback for when the animation ends
            animationGroup.onAnimationEndObservable.addOnce(() => {
                // Start the idle animation when the shoot animation ends
                //gun.isFiring = true;
                gun.idleAnimation(gun);
            });
        });
    }
    
    idleAnimation(gun: Weapon) {
        if(!this.player.isDead()) {
        if (gun.isFiring || !gun.isReloading) {
            gun.animationGroups.forEach(function (animationGroup) {
                animationGroup.stop();
                animationGroup.start(true, 0.2, 436, 498);

            });
            gun.isFiring = false; // Reset the flag
        }
    }
    }


    reloadAnimation(gun: Weapon) {
            gun.isReloading = true;
            gun.animationGroups.forEach(function (animationGroup) {
            animationGroup.stop();
            animationGroup.start(false, 1, 135, 315);
    
            // Register a callback for when the animation ends
            animationGroup.onAnimationEndObservable.addOnce(() => {
                // Start the idle animation when the shoot animation ends
                gun.isReloading = false;
                gun.idleAnimation(gun);
            });
        });
    }



    readyAnimation(gun: Weapon) {
        gun.animationGroups.forEach(function (animationGroup) {
            animationGroup.stop();
            //animationGroup.start(false, 1.5, 230, 315);
            animationGroup.start(false, 1, 340, 435);
            // Register a callback for when the animation ends
            animationGroup.onAnimationEndObservable.addOnce(() => {
                // Start the idle animation when the shoot animation ends
                //gun.isReloading = true;
                gun.idleAnimation(gun);
            });
        });
    }






    shoot(): void {
        if (this.canFire && !this.isReloading) {

        if (this.ammo > 0) {

                this.shootSound.play();

                        // Create the picking ray from the center of the screen with random deviation
                const deviationAngle = Math.random() * Math.PI * 2; // Random angle between 0 and 2*pi
                const deviationAmount = Math.random() * 0.04; // Random deviation amount
                const deviationVector = new Vector3(Math.cos(deviationAngle) * deviationAmount, 0, Math.sin(deviationAngle) * deviationAmount);
                
                // Calculate the new ray direction with deviation
                const rayDirection = this.camera.getForwardRay().direction.add(deviationVector);

          


    




            // Create the picking ray from the center of the screen
            const ray = this.scene.createPickingRay(
                this.canvas.clientWidth / 2,
                this.canvas.clientHeight / 2,
                null,
                this.camera
            );

            //ray.direction = rayDirection;
    
            // Perform the raycast and check for hits
            const raycastHit = this.scene.pickWithRay(ray);
    
            // Check if the ray hit something
            if (raycastHit && raycastHit.hit) {
                // Check if the hit object has the "enemy" tag
                if (Tags.MatchesQuery(raycastHit.pickedMesh!, "enemy")) {

                    // Get the enemy instance associated with the hit object
                    const enemy = this.getEnemyFromMesh(raycastHit.pickedMesh!);
    
                    if(enemy) {
                    // Reduce the enemy's HP by 10
                    enemy!.health -= this.damage;

                    //console.log("dead?" , enemy!.states.DESTROYED);

                    if (enemy!.health > 0) {
                        // Play shot animation on the enemy
                        this.playShotAnimation(enemy!);
                       
                    }
    
                    // Check if the enemy's HP has reached 0
                    if (enemy!.health <= 0) {
                        if(!enemy!.states.DESTROYED) {
                            this.player.score += enemy!.scoreValue;
                        // Play death animation if the enemy is killed
                        this.playDeathAnimation(enemy!);
                        enemy!.death.onAnimationEndObservable.addOnce(()=>{
                           if(enemy) {
                            const index = this.enemies.indexOf(enemy);
                            if (index !== -1) {
                               
                                this.enemies.splice(index, 1);
                            }

                            const indexFPS = this.player.firstPersonController.enemies.indexOf(enemy);
                            if (indexFPS !== -1) {
                                
                                this.player.firstPersonController.enemies.splice(indexFPS, 1);
                            }
                           
                        }

                        
                          
                  
       
                        });


                        
                       
                        enemy!.states.DESTROYED = true;
                        }
                    }
                }
            }
    
                // Create a decal to indicate the impact of the shot
                const size = 0.1;
                const decal = MeshBuilder.CreateDecal("decal", raycastHit.pickedMesh!, {
                    position: raycastHit.pickedPoint!,
                    normal: raycastHit.getNormal(true)!,
                    size: new Vector3(size, size, size)
                });
                decal.material = this.bulletHoleMaterial;
                //console.log("Raycast hit something");

                   // Dispose of the decal after 10 seconds
                   setTimeout(() => {
                    decal.dispose();
                }, 10000);
            }
    
            // Reduce ammo count and update UI
            this.ammo -= 1;
            // this.updateAmmoText(); 
        }
        }
    }
    


    reloadWeapon() {
        const remainingAmmo = this.ammo;
        const reloadAmount = Math.min(12 - remainingAmmo, this.reloadAmmo);
        this.ammo += reloadAmount;
        this.reloadAmmo -= reloadAmount;
        //this.updateAmmoText();
    }





    getEnemyFromMesh(mesh: AbstractMesh): Enemy | undefined {
        
        for (const enemy of this.enemies) {
            if (enemy.mesh === mesh) {
                return enemy;
            }
        }

        return undefined; 
    }
    

    async loadBulletholes() {
        this.bulletHoleMaterial = new PBRMaterial("bulletHoleMaterial", this.scene);

        
        // Load the bullet hole texture
       this.bulletHoleMaterial.albedoTexture = new Texture("textures/bullet_hole.png", this.scene);

        // Create a material with the bullet hole texture
        
        this.bulletHoleMaterial.albedoTexture.hasAlpha = true;
        this.bulletHoleMaterial.zOffset = -0.25;
        this.bulletHoleMaterial.roughness = 0.5;
        //this.bulletHoleMaterial.zOffset = -0.25;
        /* this.splatter = new PBRMaterial("greenSplatter", this.scene);
        this.splatter.roughness = 1;
        this.splatter.albedoTexture = new Texture("textures/green.png", this.scene);
        this.splatter.albedoTexture.hasAlpha = true;
*/
      
    
}


createMuzzleFlashParticleSystem(): void {
    // Create particle system
    this.muzzleFlashParticleSystem = new ParticleSystem("muzzleFlash", 200, this.scene);
    
    // Set particle texture
    const texture = new Texture("./textures/particles/muzzle_05.png", this.scene);
    texture._parentContainer = this.gunMesh;
    this.muzzleFlashParticleSystem.particleTexture = texture;
    
    // Set particle system properties
    this.muzzleFlashParticleSystem.emitter = this.gunMesh; // Set emitter to gun mesh
    this.muzzleFlashParticleSystem.minEmitBox = new Vector3(-8, 7, 100); 
    this.muzzleFlashParticleSystem.maxEmitBox = new Vector3(-8, 7, 100); 
  

    this.muzzleFlashParticleSystem.color1 = new Color4(0.8, 0.5, 0, 1); // Bright yellow-orange
    this.muzzleFlashParticleSystem.color2 = new Color4(0.8, 0.5, 0, 1); 
    this.muzzleFlashParticleSystem.colorDead = new Color4(1, 0.5, 0, 1); 
    
       
    this.muzzleFlashParticleSystem.minSize = 0.3; 
    this.muzzleFlashParticleSystem.maxSize = 0.74; 
    this.muzzleFlashParticleSystem.minLifeTime = 0.01; 
    this.muzzleFlashParticleSystem.maxLifeTime = 0.01; 
    this.muzzleFlashParticleSystem.emitRate = 10; 

   
    

    
    
    
    this.muzzleFlashParticleSystem.start();
    this.muzzleFlashParticleSystem.stop(); 


    
}



controlFireRate() {
    if (!this.canFire) {
        this.currentFireRate -= this.scene.getEngine().getDeltaTime();
        
        if (this.currentFireRate <= 0) {
            this.canFire = true;
            this.currentFireRate = this.fireRate;
        }
    }
}











}