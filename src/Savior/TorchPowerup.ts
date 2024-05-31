import { AbstractMesh, Vector3, Scene, SceneLoader, FreeCamera, Sound, Mesh, StandardMaterial, MeshBuilder, GlowLayer, Color3 } from "@babylonjs/core";

export class TorchPowerup {

    mesh: AbstractMesh | null;
    scene!: Scene;
    camera!: FreeCamera; 
    pickupSound: Sound;
    glowLayer: GlowLayer;
    scoreValue: number;

    constructor(scene: Scene) {
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
       
        this.glowLayer = new GlowLayer("glow", this.scene);
        this.glowLayer.intensity = 1; 
    }

    async CreateTorchPowerup(position: Vector3) {
      
        const capsuleCollider = MeshBuilder.CreateCapsule("capsuleCollider", {height: 3, radius: 0.5}, this.scene);
        capsuleCollider.isVisible = false; 
        capsuleCollider.visibility = 0.5;
        capsuleCollider.isPickable = false; 
        capsuleCollider.checkCollisions = true;
        capsuleCollider.position = position.clone(); 
        capsuleCollider.position.y += 2;


        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'torch.glb');
        this.mesh = meshes[0]; 
        this.mesh.scaling = new Vector3(0.3, 0.3, 0.3);
        this.mesh.position = position; 

      
        const glowMaterial = new StandardMaterial("glowMaterial", this.scene);
        glowMaterial.emissiveColor = new Color3(1, 1, 1); 
        glowMaterial.alpha = 0.5; 
        this.mesh.material = glowMaterial;

        
        this.mesh.setParent(capsuleCollider);

       
        capsuleCollider.id = "torchPowerup";


       
        setTimeout(() => {
            capsuleCollider.dispose();
        }, 20000);
    }

    collectTorch() {
        if (this.mesh && this.mesh.parent) {
           
            this.mesh.parent.dispose();
            this.mesh = null;
        }
    }
}
