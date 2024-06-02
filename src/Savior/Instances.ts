import { SceneLoader } from "@babylonjs/core";

export class Instances {

    mutantRoot: any;
    mutantMesh: any;
    mutantAnim: any;

    constructor() {
        this.CreateMutant();
    }


    async CreateMutant() {
        const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync('', './models/', 'mutant2.glb');

        this.mutantRoot = meshes[0];
        this.mutantMesh = meshes[1];
        this.mutantAnim = animationGroups;

        this.mutantRoot.setParent(null);
        this.mutantMesh.setParent(null);
        
        this.mutantRoot.setEnabled(false);
        this.mutantMesh.setEnabled(false);


    }
}