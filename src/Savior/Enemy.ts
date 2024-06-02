import { AbstractMesh, Tags, Animation, AnimationGroup, Color3, FreeCamera, Material, Mesh, MeshBuilder, PBRMaterial, Ray, Scene, SceneLoader, Sound, StandardMaterial, Texture, TransformNode, Vector3, Axis } from "@babylonjs/core";
import "@babylonjs/loaders";
import { Player } from "./Player";
import { Level } from "./Level";


export class Enemy {
    scene: Scene;
    animationGroups: AnimationGroup[] = [];
    health: number;
    name: string;
    mesh: AbstractMesh | null; // Property to store the mesh
    rootMesh: AbstractMesh | null;
    id: number; // Unique identifier for the enemy
    isDead: boolean;

    runSpeed!: number;
    walkSpeed!: number;

    damage!: number;
    attackSpeed!: number;

    attackSound!: Sound;



    punch!: AnimationGroup;
    run!: AnimationGroup;
    idle!: AnimationGroup;
    death!: AnimationGroup;
    shot!: AnimationGroup;
    walk!: AnimationGroup;
    uppercut!: AnimationGroup;


    randPosition!: Vector3;


    aggroRange!: number;

 

    transformNode!: TransformNode;
    enemyCollider!: any;

    collider: any;


    appliesDot: boolean;
    isSpellCasting!: boolean;


    isAttacking: boolean;
    isReacting: boolean;


    scoreValue!: number;

    static enemyCount = 0; 
    states: { DESTROYED: boolean; FOLLOWING: boolean; ATTACKING: boolean; };
    attackTimer: any;
    level: Level;
   

    constructor(scene: Scene, level: Level) {
        this.scene = scene;

     

        this.level = level;
        this.isSpellCasting = false;
        this.health = 100;
        this.name = "Monster";
        this.mesh = null; 
        this.rootMesh = null;
        this.isDead = false;
        
        this.appliesDot = false;
        this.id = ++Enemy.enemyCount; 

        this.states = {
            'DESTROYED': false,
            'FOLLOWING': false,
            'ATTACKING': false,
        };

        this.isAttacking = false;
        this.isReacting = false;

        this.generateRandomPosition();

    }

    async CreateMonster(position: Vector3): Promise<void> {
        
            const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync('', './models/', 'mutant.glb');
    
            
            meshes[1].scaling= new Vector3(2,2,2);
            
            //meshes[0].position = position;
            meshes[1].position = position;


            
            this.animationGroups = animationGroups;

            this.mesh = meshes[1];
            this.rootMesh = meshes[0];
            this.mesh.checkCollisions = true;


            Tags.AddTagsTo(this.mesh, "enemy");
          
            
            animationGroups[0].stop();
            animationGroups[2].play(true);

    

/* 
        
        this.enemyCollider = MeshBuilder.CreateBox("enemyCollider", {
                width:1,
                height: 1.7,
                depth: 1
            });
            this.enemyCollider.isPickable = false;
            
           this.enemyCollider.position = this.mesh.position;
           this.enemyCollider.position.y = 1; */

    }

deathAnimation() {
    
    // Ajouter un observateur pour détecter la fin de l'animation du groupe 3
       this.isDead = true;


       this.animationGroups[2].stop();
       this.animationGroups[3].stop();
       this.animationGroups[4].stop();
       this.animationGroups[5].stop();

           // Une fois que l'animation du groupe 3 est terminée, reprendre l'animation du groupe 1
           this.animationGroups[1].start(false);
 this.animationGroups[1].onAnimationEndObservable.addOnce(() => {
   
    this.animationGroups[1].pause();
}
 );
 

    console.log("WARROK DEAD");
    
}

idleAnimation() {
    console.log("IDLE");
}

shotAnimation() {

    this.animationGroups[5].play(false);
 // Ajouter un observateur pour détecter la fin de l'animation du groupe 3
    this.animationGroups[5].onAnimationEndObservable.addOnce(() => {
        // Une fois que l'animation du groupe 3 est terminée, reprendre l'animation du groupe 1
        this.animationGroups[2].start(true);
    });


    console.log("WARROK SHOT");
}


punchAnimation() {
    console.log("PUNCH");
}


walkAnimation() {
    console.log("WALKING");
}

runAnimation() {
    console.log("RUN");
}

updateEnemyAnimations() {
    if (this.states.DESTROYED) return;

    if (this.states.FOLLOWING || this.states.ATTACKING) {
  
        this.runAnimation();
    } else {


        if(!this.isSpellCasting) {
        this.idleAnimation();
        }
    }
}



move(player: Player): void {
    if(this.states.DESTROYED) return;
    const distanceFromPlayer = player.position.subtract(this.rootMesh!.position).length();

    if(distanceFromPlayer <= 2.5) 
    {
        this.attackPlayer(player);

    } 
    else if(distanceFromPlayer <= this.aggroRange) 
    {

        if(!this.isAttacking && !this.isReacting) {
            this.followPlayer(player);
        }
    } 
}


generateRandomPosition() {
    const randomPositionX = Math.floor((Math.random() * 100)) - (100 / 2);
    const randomPositionZ = Math.floor((Math.random() * 100)) - (100 / 2);
    

    this.randPosition = new Vector3(randomPositionX, 0, randomPositionZ);
}

followPlayer(player: Player): void {
    this.runAnimation();
    this.states.ATTACKING = false;
    this.states.FOLLOWING = true;

       

    const direction = player.position.subtract(this.rootMesh!.position).normalize();

    
    const alpha = Math.atan2(-direction.x, -direction.z);
  

    this.rootMesh!.rotation.y =  alpha;
 

      
       this.collider!.moveWithCollisions(direction.multiplyByFloats(this.runSpeed, 0, this.runSpeed));


   
}

attackPlayer(player: Player): void {
 
    

    this.states.FOLLOWING = false;
    this.states.ATTACKING = true;

  

    if (!this.attackTimer) {
        const attackInterval = 1000 / this.attackSpeed; 

        const attackOnce = () => {
            if (this.states.DESTROYED) {
              
                clearInterval(this.attackTimer);
                this.attackTimer = null;
                return;
            }

            if (this.isPlayerInRange(player)) {
                if (player.health > 0) {
                    player.health = Math.max(player.health-this.damage);

                    if(this.appliesDot && !player.hasDot) {
                        player.applyDot(2, 5000);
                    }
                   
                    this.punchAnimation();
                    this.attackSound.play();
                   
                } else {
                    console.log("Player defeated!");
                }
            }
        };

      
        attackOnce();

       
        this.attackTimer = setInterval(attackOnce, attackInterval);
    }
}


isPlayerInRange(player: Player): boolean {
   
    const distanceFromPlayer = player.position.subtract(this.rootMesh!.position).length();
    return distanceFromPlayer <= 3.5; 
}


remove() {
    if (!this.mesh || !this.rootMesh) return;

 
   
    if (this.attackTimer) {
        clearInterval(this.attackTimer);
        this.attackTimer = null;
    }

   


   
    setTimeout(() => {
        this.mesh!.dispose();
        this.rootMesh!.dispose();
       

     
        this.states.DESTROYED = true;

       
    }, 25000);
}



}




