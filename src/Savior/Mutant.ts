import { AnimationGroup, GizmoManager, PhysicsImpostor, Scene, SceneLoader, Sound, Tags, Vector3, TransformNode, MeshBuilder, StandardMaterial, Color3, AbstractMesh } from "@babylonjs/core";
import { Enemy } from "./Enemy";
import { Level } from "./Level";


export class Mutant extends Enemy {
    
  
    


    constructor(scene: Scene, level: Level) {
        super(scene, level);
        this.name = "Mutant";
        this.damage = 5;
        this.scoreValue = 50;
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

        this.health = 150;

    //this.transformNode = new TransformNode("RotationNode", this.scene);
    
    }

    async CreateMonster(position: Vector3): Promise<void> {


        this.createBoxCollider();
    
       
        
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync('', './models/', 'mutant2.glb');
    
   
        this.mesh = meshes[1];
        this.rootMesh = meshes[0];
       
        /* this.rootMesh.physicsImpostor = new PhysicsImpostor(
            this.rootMesh,
            PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.1, friction: 0 },
            this.scene
        );
 */

        this.rootMesh!.checkCollisions = true;
        //this.rootMesh.physicsImpostor = new PhysicsImpostor(this.rootMesh, PhysicsImpostor.MeshImpostor, { mass: 100, restitution: 0.1 }, this.scene);
        this.rootMesh!.rotationQuaternion = null;
      
        
        this.rootMesh!.position = position;
        this.collider.position = this.rootMesh!.position.clone();
        this.collider.position.y += 1;
        //this.mesh.showBoundingBox = true;

        //this.rootMesh.scaling = new Vector3(1.5,1.5,1.5);
   
            
        //this.rootMesh.physicsImpostor.setScalingUpdated();
        //this.mesh.checkCollisions = true;

      

        //this.rootMesh!.parent = this.collider;
        //this.rootMesh!.setParent(this.collider);

        // Set animation groups
        this.animationGroups = animationGroups;
        this.death =  this.animationGroups[1];
        this.idle =  this.animationGroups[2];
        this.punch =  this.animationGroups[3];
        this.run =  this.animationGroups[4];
        this.shot =  this.animationGroups[5];
        this.uppercut =  this.animationGroups[6];
        this.walk =  this.animationGroups[7];
    
     
    
        // Add tags
        Tags.AddTagsTo(this.mesh, "enemy");
    
        // Start animations
        this.animationGroups[0].stop();
        this.animationGroups[4].play(true);
    
        // Set movement speeds
        this.runSpeed = 0.3;
        this.walkSpeed = 0.07;
    

     



       
     

     

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
        this.collider.isVisible = false;
    
        this.collider.checkCollisions = true;
        this.collider.isPickable = false;
    
       
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
 
    //console.log(" DEAD");
    
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
    // Check if any other animation group is currently playing

    this.idle.stop();
    this.walk.stop();

    const isAnyAnimationPlaying = this.animationGroups.some(animationGroup => animationGroup.isPlaying);

    // Start the "run" animation group only if no other animation is currently playing
    if (!isAnyAnimationPlaying) {
        this.run.start(true);
        //console.log("RUN");
    }
}

cloneAnimationGroups(sourceAnimationGroups: AnimationGroup[], targetMesh: AbstractMesh): AnimationGroup[] {
    return sourceAnimationGroups.map(sourceGroup => {
        const newGroup = new AnimationGroup(sourceGroup.name);
        
        sourceGroup.targetedAnimations.forEach(targetedAnim => {
            const newAnim = targetedAnim.animation.clone();
            newGroup.addTargetedAnimation(newAnim, targetMesh);
        });
        
        return newGroup;
    });


}


}