import { AbstractMesh, Animation, Vector3, Scene, SceneLoader, FreeCamera, Sound, MeshBuilder, StandardMaterial, Texture, SpriteManager, Sprite, GlowLayer, Color3, Color4, Mesh, EasingFunction } from "@babylonjs/core";

export class WeaponPickups {

    mesh: AbstractMesh | null;
    scene!: Scene;
    camera!: FreeCamera; 
    pickupSound: Sound;
    spriteManager: any;
    glowLayer: GlowLayer;

    constructor() {
        this.mesh = null;
       this.pickupSound = new Sound(
        "weaponPickup",
        "./audio/pickups/ammobox.mp3",
        this.scene,
        null,
        {
            //spatialSound: true,
            volume: 1,
            autoplay: false
        });


        //this.spriteManager = new SpriteManager("spriteManager", "textures/arrow.png", 1, 256, this.scene);


        this.glowLayer = new GlowLayer("glow", this.scene);
        this.glowLayer.intensity = 1; 

    }



    async CreateMinigunPickup(position: Vector3) {

        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'minigun.glb');
        this.mesh = meshes[0]; 
        this.mesh.scaling = new Vector3(0.01, 0.01, 0.01);
        this.mesh.position = position;
        this.mesh.position.y += 0.1; 
      
        meshes[1].checkCollisions = true;
        meshes[1].id = "minigunPickup";

     /*    const arrow = this.createGlowingArrow(meshes[1]);
       
        this.CreateAnimations(arrow); */
       
        
    }


    async CreatePistolPickup(position: Vector3) {

        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'pistol2.glb');
        this.mesh = meshes[0]; 
       this.mesh.scaling = new Vector3(0.02, 0.02, 0.02);
        this.mesh.position = position;
        this.mesh.position.y += 0.1; 
      
        meshes[1].checkCollisions = true;
        meshes[1].id = "pistolPickup";

   /*      const arrow = this.createGlowingArrow(meshes[1]);
       
        this.CreateAnimations(arrow); */
       
        
    }

    async CreateRiflePickup(position: Vector3) {

        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'rifle2.glb');
        this.mesh = meshes[0]; 
        this.mesh.scaling = new Vector3(0.02, 0.02, 0.02);
        this.mesh.position = position;
        this.mesh.position.y += 0.1; 
      
        meshes[1].checkCollisions = true;
        meshes[1].id = "riflePickup";

        /* const arrow = this.createGlowingArrow(meshes[1]);
       
        this.CreateAnimations(arrow);
        */
        
    }

    async CreateLMGPickup(position: Vector3) {

        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'lmg2.glb');
        this.mesh = meshes[0]; 
        this.mesh.scaling = new Vector3(2, 2, 2);
        this.mesh.position = position;
        this.mesh.position.y += 0.1; 
      
        meshes[1].checkCollisions = true;
        meshes[1].id = "lmgPickup";

        /* const arrow = this.createGlowingArrow(meshes[1]);
       
        this.CreateAnimations(arrow); */
    }




    /* async createGlowingArrow(parent: any) {
        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/', 'arrow.glb');
        const arrowMesh = meshes[0] as Mesh;
        arrowMesh.scaling = new Vector3(0.5,0.5,0.5);
     
    
        const arrowMaterial = new StandardMaterial('arrowMaterial', this.scene);
        arrowMaterial.emissiveColor = Color3.FromHexString('#00FF00'); 

        arrowMesh.material = arrowMaterial;
   
         
        // Parent arrow to the  mesh
        arrowMesh.setParent(parent);

        arrowMesh.position = parent.position.clone();
        
        
       return arrowMesh;



        

        
    }
 */

  /*   CreateAnimations(mesh: any) {
        const rotateFrames = [];
        const fps = 60;

        const rotateAnim = new Animation("rotateAnim", "rotation.y", fps, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);


        rotateFrames.push({frame: 0, value:0});
        rotateFrames.push({frame: 180, value:Math.PI/2});


        rotateAnim.setKeys(rotateFrames);


        mesh.animations.push(rotateAnim);


        this.scene.beginAnimation(mesh, 0, 180 )
    }
     */
  
}