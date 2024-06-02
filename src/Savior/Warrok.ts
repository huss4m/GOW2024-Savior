import { AnimationGroup, GizmoManager, PhysicsImpostor, Scene, SceneLoader, Sound, Tags, Vector3, TransformNode, MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { Enemy } from "./Enemy";
import { Level } from "./Level";


export class Warrok extends Enemy {
    
  
    


    constructor(scene: Scene, level: Level) {
        super(scene, level);
        this.name = "Warrok";
        this.damage = 12;
        this.scoreValue = 100;
        this.attackSpeed = 0.4;
        this.attackSound = new Sound(
            "shootSound",
            "./audio/attack/mutant.mp3",
            this.scene,
            null,
            {
                //spatialSound: true,
                volume: 0.6,
                autoplay: false
            }
        );

        //this.attackSound.attachToMesh(this.rootMesh);

        this.aggroRange = 200;
        


        
    //this.transformNode = new TransformNode("RotationNode", this.scene);
    this.health = 120;
    }

    async CreateMonster(position: Vector3): Promise<void> {


        this.createBoxCollider();
    

        
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync('', './models/', 'warrokk.glb');
    
   
        this.mesh = meshes[1];
        this.rootMesh = meshes[0];

       

        this.rootMesh.checkCollisions = true;
        //this.rootMesh.physicsImpostor = new PhysicsImpostor(this.rootMesh, PhysicsImpostor.MeshImpostor, { mass: 100, restitution: 0.1 }, this.scene);
        this.rootMesh!.rotationQuaternion = null;
        
        this.rootMesh.position = position;
        this.collider.position = this.rootMesh.position.clone();
        this.collider.position.y += 1;
        //this.mesh.showBoundingBox = true;

        //this.rootMesh.scaling = new Vector3(1.5,1.5,1.5);
   
            
        //this.rootMesh.physicsImpostor.setScalingUpdated();
        //this.mesh.checkCollisions = true;
     
      

        //this.rootMesh!.parent = this.collider;
        //this.rootMesh!.setParent(this.collider);

        // Set animation groups
        this.animationGroups = animationGroups;
        this.death = animationGroups[1];
        this.idle = animationGroups[2];
        this.punch = animationGroups[3];
        this.run = animationGroups[4];
        this.shot = animationGroups[5];
        this.walk = animationGroups[2];
    
     
    
        // Add tags
        Tags.AddTagsTo(this.mesh, "enemy");
    
        // Start animations
        animationGroups[0].stop();
        animationGroups[4].play(true);
    
        // Set movement speeds
        this.runSpeed = 0.2;
        this.walkSpeed = 0.07;
    
        //console.log(animationGroups);


     



       

            this.scene.registerBeforeRender(() => {
                
                this.rootMesh!.position.x = this.collider.position.x;
                this.rootMesh!.position.z = this.collider.position.z;
            });
      
    }
    
    createBoxCollider() {
    
        this.collider = MeshBuilder.CreateBox("collider", { height: 1.5, width: 1, depth: 1 }, this.scene);
       // this.collider.scaling = new Vector3(1.5, 3, 1.5); 

   

       //this.collider.scaling.y = 0.5;
    
 
      
        this.collider.visibility = 0.3;
    
        this.collider.checkCollisions = true;
        this.collider.isPickable = false;
        this.collider.isVisible = false;
       
    }

deathAnimation() {
    

       this.isDead = true;


       this.animationGroups[2].stop();
       this.animationGroups[3].stop();
       this.animationGroups[4].stop();
       this.animationGroups[5].stop();


        this.death.start(false);

           
    this.collider.dispose();

    this.remove();
 
   // console.log(" DEAD");
    
}

idleAnimation() {

    this.idle.start(false);
    //console.log("IDLE");
}

shotAnimation() {
    this.isReacting = true;
    this.shot.play(false);

    this.shot.onAnimationEndObservable.addOnce(() => {
        this.isReacting = false;
    });
    //console.log(" SHOT");
}


punchAnimation() {

    this.animationGroups.forEach(animationGroup => {
        animationGroup.stop();
    });

   this.isAttacking = true;
   this.punch.start(false);

   this.punch.onAnimationEndObservable.addOnce(() => {
        this.isAttacking = false;
    
});
   
   //return this.animationGroups[1];
    //console.log("PUNCH");
}


walkAnimation() {

    this.walk.start(false);
    //console.log("WALKING");
}

runAnimation() {
   

    this.idle.stop();
    this.walk.stop();

    const isAnyAnimationPlaying = this.animationGroups.some(animationGroup => animationGroup.isPlaying);

   
    if (!isAnyAnimationPlaying) {
        this.run.start(true);
        
    }
}





}