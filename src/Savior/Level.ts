import { Scene, SceneLoader, Mesh, HemisphericLight, CubeTexture, Engine, Vector3, MeshBuilder, StandardMaterial, Color3, Sound, PBRMaterial, Texture, CannonJSPlugin , PhysicsImpostor, PointLight, ShadowGenerator, DirectionalLight, Light, LightGizmo, GizmoManager, ICullable, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";
import { Enemy } from "./Enemy";
import { Mutant } from "./Mutant";
import * as CANNON from "cannon";
import { FirstPersonController } from "./FirstPersonController";
import { WeaponPickups } from "./WeaponPickups";
import { Weapon } from "./Weapon";
import { AmmoPickup } from "./AmmoPickup";
import { FirstAidPickup } from "./FirstAidPickup";
import { Warrok } from "./Warrok";
import { Boss } from "./Boss";
import { SkeletonZombie } from "./SkeletonZombie";
import { TorchPowerup } from "./TorchPowerup";
import { MedalPowerup } from "./MedalPowerup";
import { Instances } from "./Instances";


export class Level {
    scene: Scene;
    enemies!: Enemy[];
    engine: Engine;
    firstPersonController: FirstPersonController;
    waveIntervalId: number | undefined; // Store the interval ID

    waveNumber!: number;
    nextWaveTime: number;

    enemyNumber!: number;
    weaponPickups: WeaponPickups;
    firstaid: FirstAidPickup;
    ammopickup: AmmoPickup;
    torchPowerup: any;
    medalPowerup: MedalPowerup;

    meshes: any;
    instances!: Instances;



    constructor(engine: Engine, firstPersonController: FirstPersonController) {
        this.engine = engine;

        this.scene = this.CreateScene();
        this.firstPersonController = firstPersonController;

        this.waveNumber = 0;
        this.nextWaveTime = 60;

        this.engine.displayLoadingUI();
        this.CreateEnvironment();
        this.CreateImpostors();

        this.createWall(new Vector3(-35, 0, -13));
         this.createWall(new Vector3(-35, 0, 122));


        this.createHWall(new Vector3(12,0,55));
        this.createHWall(new Vector3(-82,0,55));


        //this.CreateTorch();

        this.weaponPickups = new WeaponPickups();
        this.ammopickup = new AmmoPickup(this.scene, this.firstPersonController.camera);
        this.firstaid = new FirstAidPickup(this.scene, this.firstPersonController.camera);
        
        this.torchPowerup = new TorchPowerup(this.scene, this.firstPersonController.camera);
        this.medalPowerup = new MedalPowerup(this.scene, this.firstPersonController.camera);

       // this.instances = new Instances();
  
  
    }

    
    CreateScene(): Scene {
        const scene = new Scene(this.engine);
    
        const hemilight = new HemisphericLight("hemi", new Vector3(0,1,0), this.scene);
    
        hemilight.intensity = 0.3;
        //const light = new PointLight("pointLight", new Vector3(75, 50, -70), scene)
        const light = new DirectionalLight("DirectionalLight", new Vector3(-1, -1, -0.75), scene);

        const envTex = CubeTexture.CreateFromPrefilteredData(
            "./environment/environment.env",
            scene
          );

          
          light.intensity = 3;
          //light.position = new Vector3(0,10,0);
    /*       light.shadowEnabled = true;
          light.shadowMinZ = 1;
          light.shadowMaxZ = 10;  */

       //this.CreateGizmos(light);

          const shadowGen = new ShadowGenerator(2048, light);
          shadowGen.useBlurCloseExponentialShadowMap = true;
      
          scene.environmentTexture = envTex;
      
          scene.createDefaultSkybox(envTex, true);
      
          scene.environmentIntensity = 0.5;
    
          scene.enablePhysics(new Vector3(0,-9.81,0), new CannonJSPlugin(true, 10, CANNON));
    
    
    
        
        scene.collisionsEnabled = true;
    
        return scene;
      }
      CreateAsphalt(): PBRMaterial {
        const pbr = new PBRMaterial("pbr", this.scene);
    
        // Albedo texture
        const albedoTexture = new Texture("./textures/grass/grass_diff.png", this.scene);
        albedoTexture.uScale = 200;
        albedoTexture.vScale = 200;
        pbr.albedoTexture = albedoTexture;
    
        // Bump texture
        const bumpTexture = new Texture("./textures/grass/grass_norm.png", this.scene);
        bumpTexture.uScale = 200;
        bumpTexture.vScale = 200;

        pbr.bumpTexture = bumpTexture;
        pbr.invertNormalMapX = true;
        pbr.invertNormalMapY = true;
    
        // Metallic texture
        const metallicTexture = new Texture("./textures/grass/grass_arm.jpg", this.scene);
        metallicTexture.uScale = 200;
        metallicTexture.vScale = 200;
        
        pbr.metallicTexture = metallicTexture;
    
        pbr._useAmbientOcclusionFromMetallicTextureRed = true;
        pbr.useRoughnessFromMetallicTextureGreen = true;
        pbr.useMetallnessFromMetallicTextureBlue = true;
    
        return pbr;
    }
    
  
      async CreateEnvironment(): Promise<void> {
         
        const { meshes } = await SceneLoader.ImportMeshAsync(
                "",
                "./models/",
                "stadetest8.glb",
                this.scene
            );


    

        meshes.forEach((mesh) => {

       
        // Enable collisions
        //mesh.checkCollisions = true;
        mesh.isPickable = true; 
        mesh.receiveShadows = true;


        mesh.freezeWorldMatrix();
        mesh.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY;

       // We remove non visible parts
        if(mesh.name === "Doors"  || mesh.name === "Stairs" || mesh.name === "Gates" || 
        mesh.name === "Entrance Steps" || mesh.name ==="End Terraces" || mesh.name === "Dividers" || mesh.name === "Doorknobs" || mesh.name === "Door Handles" 
        || mesh.name ==="Door Frames." || mesh.name === "Ground Level"
        || mesh.name === "Flag Pole Bases" || mesh.name === "Pressbox" || mesh.name === "Gates 02" ) {
        mesh.isVisible = false;
       }
      
        
     }); 

     this.meshes = meshes;
    

    
      
        const ground = MeshBuilder.CreateGround( "ground",
        {width: 250, height: 250},
        this.scene);

        const groundMaterial = this.CreateAsphalt();

       

        ground.position = new Vector3(-35, 0.05, 55);
      
        ground.material = groundMaterial;
                
        
        ground.checkCollisions = true; 
        ground.receiveShadows = true;
        //ground.isVisible = false;

        //ground.renderingGroupId = 0;

         ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.BoxImpostor,
            {mass:0, restitution:0}
        ); 
        
      
 

     
        //this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

     
        //this.CreateTrack();

         const backgroundMusic = new Sound(
            "backgroundMusic",
            "./audio/background4.mp3",
            this.scene,
            null,
            {
                volume: 0.6,
                autoplay: true,
                loop: true
          }
        );


        //this.engine.hideLoadingUI();

    }




    async generateEnemies(number: number): Promise<void> {
        this.waveNumber+=1;

        const minX = -81; 
        const maxX = 11;
        const minZ = -7; 
        const maxZ = 114; 
   

        if(this.waveNumber  == 2) {
            this.firstPersonController.inventory.push(this.firstPersonController.rifle);
            this.weaponPickups.CreateRiflePickup(new Vector3(Math.random() * (maxX - minX) + minX,0.1,Math.random() * (maxZ - minZ) + minZ));
           
        }

        if(this.waveNumber == 4) {
            this.firstPersonController.inventory.push(this.firstPersonController.lmg);
            this.weaponPickups.CreateLMGPickup(new Vector3(Math.random() * (maxX - minX) + minX,0.1,Math.random() * (maxZ - minZ) + minZ));
        }

        if(this.waveNumber == 7) {
            this.firstPersonController.inventory.push(this.firstPersonController.minigun);
            this.weaponPickups.CreateMinigunPickup(new Vector3(Math.random() * (maxX - minX) + minX,0.1,Math.random() * (maxZ - minZ) + minZ));
        }



        for (let i = 0; i < number + 1; i++) {
      
    
          
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomZ = Math.random() * (maxZ - minZ) + minZ;
    
           
            const position = new Vector3(randomX, 0.1, randomZ);
            const mutant = new Mutant(this.scene, this);
            await mutant.CreateMonster(position);
    
            this.firstPersonController.enemies.push(mutant);
        }



        if(this.waveNumber >= 2) {
            for (let i = 0; i < number -2 + 1; i++) {
      
    
               
                const randomX = Math.random() * (maxX - minX) + minX;
                const randomZ = Math.random() * (maxZ - minZ) + minZ;
        
             
                const position = new Vector3(randomX, 0.1, randomZ);
                const warrok = new Warrok(this.scene, this);
                await warrok.CreateMonster(position);
        
                this.firstPersonController.enemies.push(warrok);
            }
        }



        if(this.waveNumber >= 4) {
            for (let i = 0; i < number -2 + 1; i++) {
      
    
               
                const randomX = Math.random() * (maxX - minX) + minX;
                const randomZ = Math.random() * (maxZ - minZ) + minZ;
        
               
                const position = new Vector3(randomX, 0.1, randomZ);
                const skeletonZombie = new SkeletonZombie(this.scene, this);
                await skeletonZombie.CreateMonster(position);
        
                this.firstPersonController.enemies.push(skeletonZombie);
        }
    }


    if(this.waveNumber === 8) {
        this.stopWaveSystem();
        this.nextWaveTime=0;

       
        const randomX = Math.random() * (maxX - minX) + minX;
        const randomZ = Math.random() * (maxZ - minZ) + minZ;

       
        const position = new Vector3(randomX, 0.1, randomZ);
        const boss = new Boss(this.scene, this.firstPersonController.player, this);
        await boss.CreateMonster(position);

        this.firstPersonController.enemies.push(boss);
    }
}
    

    startWaveSystem(): void {
        
        this.waveIntervalId = setInterval(() => {
            this.generateEnemies(this.waveNumber);
            this.nextWaveTime = 60;
        }, 60000);



        setInterval(() => {
            if (this.nextWaveTime > 0) {
                this.nextWaveTime -= 1;
            }
        }, 1000);
    
    
    
        this.startPickupGeneration();
    
    }

    stopWaveSystem(): void {
       
        if (this.waveIntervalId !== undefined) {
            clearInterval(this.waveIntervalId);
        }
    }




    startPickupGeneration(): void {
        

        const minX = -82; 
        const maxX = 12;
        const minZ = -8; 
        const maxZ = 115; 


        const minY = 0.1;
        const maxY = 0.2;
   

        setInterval(() => {
            this.ammopickup.CreateAmmoPickup(new Vector3(Math.random() * (maxX - minX) + minX,0.1,Math.random() * (maxZ - minZ) + minZ));
        }, 60000); 


        setInterval(() => {
            this.firstaid.CreateFirstAidPickup(new Vector3(Math.random() * (maxX - minX) + minX,0.1,Math.random() * (maxZ - minZ) + minZ));
        }, 60000); 



        

        setInterval(() => {
            this.torchPowerup.CreateTorchPowerup(new Vector3(Math.random() * (maxX - minX) + minX,
            Math.random() * (maxY - minY) + minY,
            Math.random() * (maxZ - minZ) + minZ));
          }, 20000); 


        setInterval(() => {
            this.medalPowerup.CreateMedalPowerup(new Vector3(Math.random() * (maxX - minX) + minX,
            Math.random() * (maxY - minY) + minY,
            Math.random() * (maxZ - minZ) + minZ));
        }, 20000); 



    }


    createWall(position: Vector3): void {
        
        const wallWidth = 95;
        const wallHeight = 5;
        const wallDepth = 0.5;
        const wallPosition = position; 

       
        const wall = MeshBuilder.CreateBox("wall", { width: wallWidth, height: wallHeight, depth: wallDepth }, this.scene);

       
        wall.position = wallPosition;

       
        const wallMaterial = new StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5); 
        wall.material = wallMaterial;

        wall.physicsImpostor = new PhysicsImpostor(
            wall,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0, friction: 0 },
            this.scene
        );
       
        wall.checkCollisions = true;

        wall.isVisible = false;
        
    }
      
    createHWall(position: Vector3): void {
      
        const wallWidth = 135;
        const wallHeight = 15;
        const wallDepth = 0.5;
        const wallPosition = position; 

        
        const wall = MeshBuilder.CreateBox("wall", { width: wallWidth, height: wallHeight, depth: wallDepth }, this.scene);

       
        wall.position = wallPosition;
        wall.rotation.y = Math.PI/2;

       
        const wallMaterial = new StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5); 
        wall.material = wallMaterial;

        wall.physicsImpostor = new PhysicsImpostor(
            wall,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0, friction: 0 },
            this.scene
        );
        
        wall.checkCollisions = true;
        wall.isVisible = false;
        
    }

    async CreateTorch() {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync("", "./models/pickups/", "torch.glb");
        meshes[0].position = new Vector3(-25, 0.5, 50);
    }

    CreateImpostors(): void {
         const ground = MeshBuilder.CreateGround("groundImpostor", {width:200, height:200 });
         ground.isVisible = false;
         ground.position.y += 0.05;
          ground.physicsImpostor = new PhysicsImpostor(
             ground,
             PhysicsImpostor.BoxImpostor,
             {mass:0, restitution:0}
         ); 

         
         this.firstPersonController.ground = ground;

   

        
     }


     async CreateTrack() {
        const {meshes} = await SceneLoader.ImportMeshAsync(
            "",
             "./models/",
             "runtrack.glb",
             this.scene
         );

         meshes.forEach((mesh) => {
            
           
            // Enable collisions
            //mesh.checkCollisions = true;
            mesh.receiveShadows = true;
            mesh.position.y = 0.9
            //mesh.isVisible = false;
         }); 
     }

     checkFrustumVisibility(): void {
        if(this.meshes) {
        
        this.meshes.forEach((mesh: Mesh) => {
            if (!this.firstPersonController.camera.isInFrustum(mesh)) {
                mesh.isVisible = false;
            } else {
                mesh.isVisible = true;
            }
        });
    }
    }

}