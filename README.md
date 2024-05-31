# Projet Games on Web 2024: Savior
Jeu de type First Person Shooter sur le thème "Olympic Edition" pour la compétition Games on Web 2024.


# Membres (1):
BOUCHAKOUR Hussam - L3 Informatique Université d'Aix-Marseille

# Liens:
- [Visitez le dépôt GitHub](https://github.com/huss4m/GOW2024-Savior)
- [Jouer en ligne](https://huss4m.github.io/GOW2024-Savior/)
- [Vidéo Gameplay](https://www.youtube.com/watch?v=I1j9r0GtFgI)

## Mode d'emploi

### Se déplacer

- **Espace** - Sauter
- **Shift** - Sprinter
- **R** - recharger

#### AZERTY

- **Z** - en avant
- **S** - en arrière
- **D** - à droite
- **Q** - à gauche

#### QWERTY

- **W** - en avant
- **S** - en arrière
- **D** - à droite
- **A** - à gauche


1 2 3 et 4: armes 1, 2, 3 et 4 dans l'inventaire  
Vous pouvez aussi utiliser la molette de la souris afin de circuler dans l'inventaire.
La touche 9 active un Godmode (triche): toutes vos stats sont au maximum et vous possédez 9000 points de vie ce qui vous rend quasiment invincible, vous pouvez vous en servir en cas de difficulté pour finir le jeu.



## Scénario

Le stade olympique est attaqué par une horde de mutants, votre mission est de repousser cette menace et de vaincre leur chef. Le stade est rempli d'artéfacts olympiques mystérieux qui boostent les capacités athlétiques de votre personnage, comme son endurance, sa vitesse de sprint ou encore ses dégâts.

## Types d'ennemis

- **Mutant**: Attaque à dégâts moyens, vitesse moyenne, apparaît dès la première vague, résistance faible. 
- ![Mutant](https://raw.githubusercontent.com/huss4m/GOW2024-Savior/main/Mutant.png)

- **Warrok**: Lourds dégâts, vitesse faible, apparaît à partir de la 2ème vague, résistance moyenne.
- ![Warrok](https://raw.githubusercontent.com/huss4m/GOW2024-Savior/main/Warrok.png)
  
- **Zombie**: Lourds dégâts et inflige "Blessure mortelle" à chaque attaque: vous perdez alors 2 points de vie par seconde pendant 5 secondes, vitesse moyenne, apparaît à partir de la 4ème vague, grande résistance.
- -![Zombie](https://raw.githubusercontent.com/huss4m/GOW2024-Savior/main/Zombie.png)
  
- **Boss final**: Vitesse très faible mais très lourds dégâts, très résistant, possède une attaque à distance "Onde de choc" qui vous inflige de lourds dégâts et vous ralentit de 50% pendant 6 secondes.
- ![Boss](https://raw.githubusercontent.com/huss4m/GOW2024-Savior/main/Boss.png)

## But du jeu

Défendre le stade olympique de l'attaque des mutants jusqu'à vaincre le boss final qui apparaît à la 8ème vague. Les vagues deviennent de plus en plus difficiles à gérer, il vous faudra récupérer le plus possible d'artéfacts olympiques afin d'augmenter les capacités physiques et athlétiques de votre personnage.

## Artéfacts Olympiques

- **Torche olympique**:
- ![Torche](https://raw.githubusercontent.com/huss4m/GOW2024-Savior/main/torch.png)
  - Augmente votre talent de tireur, vous infligez plus de dégâts avec toutes les armes de manière permanente
  - Augmente votre endurance: la barre d'endurance diminue moins vite lorsque vous sprintez, et elle récupère plus vite lorsque vous arrêtez.

- **Médaille olympique**:
- ![Medaille](https://raw.githubusercontent.com/huss4m/GOW2024-Savior/main/medal1.png)
  - Augmente votre vitesse de sprint
  - Augmente votre hauteur de saut

Ces artéfacts apparaissent pendant une durée limitée dans le stade, il faut donc rester vigilant afin de les récupérer à temps.

## Autres ressources

- **Caisse de munitions**:
  - Vous donne quelques munitions.

- **Kit de premiers-soins**:
  - Vous rend tous vos points de vie.

Ceux-ci ne disparaissent pas, vous pouvez donc choisir, par exemple, de ne pas prendre un kit de premiers-soins avant d'être gravement blessé.

## Armes du jeu

- **Pistolet**: Disponible dès le début  
  Dégâts faibles (relativement aux autres armes) mais possède une vitesse de recharge élevée et une bonne précision. Elle est non-automatique.  
  Utile contre des ennemis peu nombreux, ou comme arme secondaire.

- **Fusil d'assaut**: Disponible dès la 2ème vague  
  Dégâts moyens, vitesse de recharge élevée, bonne précision, non-automatique.  
  Très efficace pour vaincre rapidement des ennemis peu nombreux sans dépenser trop de munitions.

- **LMG**: Disponible dès la 4ème vague  
  Dégâts lourds, vitesse de recharge très faible, précision moyenne, automatique à cadence de tir élevée.  
  Utile contre des ennemis plus résistants ou des ennemis plus nombreux.

- **Minigun**: Disponible dès la 7ème vague  
  Dégâts très lourds, vitesse de recharge faible, précision faible, automatique à cadence de tir très élevée.  
  Utile contre des ennemis très résistants ou un rassemblement important d'ennemis, gourmand en munitions.

Les armes sont débloquées automatiquement dans l'inventaire au moment où elles sont disponibles.


# Instructions pour jouer en local

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

1. [Node.js et npm](https://nodejs.org/)
2. [Git](https://git-scm.com/)

## Étapes d'installation

1. **Cloner le dépôt**

   Ouvrez votre terminal et exécutez la commande suivante pour cloner le dépôt GitHub :

   ```bash
   git clone https://github.com/huss4m/GOW2024-Savior.git
   ```

2. **Naviguer dans le répertoire du projet**

   Déplacez-vous dans le répertoire du projet cloné :

   ```bash
   cd GOW2024-Savior
   ```

3. **Installer les dépendances**

   Exécutez la commande suivante pour installer toutes les dépendances nécessaires :

   ```bash
   npm install
   ```

## Démarrer le serveur local

Une fois les dépendances installées, démarrez le serveur de développement local en exécutant la commande suivante :

```bash
npm run serve
```

Cette commande lancera le serveur et affichera une URL dans votre terminal, généralement `http://localhost:8080`, où vous pourrez accéder à votre jeu.

## Accéder au jeu

Ouvrez votre navigateur web et accédez à l'URL suivante pour commencer à jouer :

```
http://localhost:8080
```


