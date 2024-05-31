import { AbstractMesh, Vector3, Scene, SceneLoader, FreeCamera, Sound, Mesh, StandardMaterial, MeshBuilder, GlowLayer, Color3 } from "@babylonjs/core";

export class MedalPowerup {

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
            "./audio/pickups/ammobox.mp3", 
            this.scene,
            null,
            {
                volume: 1,
                autoplay: false
            }
        );
        // Create a glow layer and add it to the scene
        this.glowLayer = new GlowLayer("glow", this.scene);
        this.glowLayer.intensity = 2; // Adjust glow intensity as needed
    }

    async CreateMedalPowerup(position: Vector3) {
        
        const sphereCollider = MeshBuilder.CreateSphere("sphereCollider", {diameter: 1}, this.scene);
        sphereCollider.isVisible = false;
        sphereCollider.visibility = 0.5;
        sphereCollider.isPickable = false;
        sphereCollider.scaling = new Vector3(1.5, 2, 1.5); 
        sphereCollider.position = position.clone(); 
        sphereCollider.checkCollisions = true;
        sphereCollider.position.y += 1;

        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/pickups/', 'medal.glb');
        this.mesh = meshes[0]; 
        this.mesh.scaling = new Vector3(0.3, 0.3, 0.3);
        this.mesh.position = position; 

        
        const glowMaterial = new StandardMaterial("glowMaterial", this.scene);
        glowMaterial.emissiveColor = new Color3(1, 1, 1); 
        glowMaterial.alpha = 0.5; 
        this.mesh.material = glowMaterial;

       
        this.mesh.setParent(sphereCollider);

        
        sphereCollider.id = "medalPowerup";

        setTimeout(() => {
            sphereCollider.dispose();
        }, 20000);
    }

    collectMedal() {
        if (this.mesh && this.mesh.parent) {
          
            this.mesh.parent.dispose();
            this.mesh = null;
        }
    }
}
