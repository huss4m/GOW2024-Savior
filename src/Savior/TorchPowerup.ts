import { AbstractMesh, Vector3, Scene, SceneLoader, FreeCamera, Sound, Mesh, StandardMaterial, MeshBuilder, GlowLayer, Color3 } from "@babylonjs/core";

export class TorchPowerup {

    mesh: AbstractMesh | null;
    scene!: Scene;
    camera!: FreeCamera; 
    pickupSound: Sound;
    glowLayer: GlowLayer;
    scoreValue: number;

    meshes: any;

    constructor(scene: Scene, camera: FreeCamera) {
        this.mesh = null;
        this.scene = scene;
        this.scoreValue = 100;
        this.pickupSound = new Sound(
            "",
            "./audio/pickups/torch.mp3", 
            this.scene,
            null,
            {
                volume: 2,
                autoplay: false
            }
        );
       this.camera = camera;
        this.glowLayer = new GlowLayer("glow", this.scene);
        this.glowLayer.intensity = 1; 
    }

    async CreateTorchPowerup(position: Vector3) {
      
        const sphereCollider = MeshBuilder.CreateSphere("sphereCollider", {diameter: 0.1}, this.scene);
        sphereCollider.isVisible = false; 
        sphereCollider.visibility = 0.5;
        sphereCollider.isPickable = false; 
        sphereCollider.checkCollisions = true;
        sphereCollider.scaling = new Vector3(15, 1, 15); 

        sphereCollider.position = position.clone(); 
        sphereCollider.position.y += 0.1;


        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'torch.glb');
        this.mesh = meshes[0]; 
        this.mesh.scaling = new Vector3(0.3, 0.3, 0.3);
        this.mesh.position = position; 


        //this.meshes = meshes;

  

      
        const glowMaterial = new StandardMaterial("glowMaterial", this.scene);
        glowMaterial.emissiveColor = new Color3(1, 1, 1); 
        glowMaterial.alpha = 0.5; 
        this.mesh.material = glowMaterial;

        
        this.mesh.setParent(sphereCollider);

       
        sphereCollider.id = "torchPowerup";


       
        setTimeout(() => {
            sphereCollider.dispose();
        }, 20000);
    }

    collectTorch() {
        if (this.mesh && this.mesh.parent) {
           
            this.mesh.parent.dispose();
            this.mesh = null;
        }
    }


    checkFrustumVisibility(): void {
        if(this.meshes) {
       
        this.meshes.forEach((mesh: Mesh) => {
            if(mesh){
            if (!this.camera.isInFrustum(mesh)) {
                mesh.isVisible = false;
            } else {
                mesh.isVisible = true;
            }
        }
        });
    }
}
}
