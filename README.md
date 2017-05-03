# battle.IO
## Auteurs 
  Walid Birjam, Alexandre D'Ambra, Pierre Tinland
  
## Règles
  Battle.io est un jeu de stratégie en temps réel, en 1 VS 1.<br>
  Le but du jeu est de développer votre ville de façon à avoir le maximum de ressources, et pouvoir recruter les troupes nécessaires à la défense de votre ville, et à la destruction de celle de l'adversaire.<br>
  La destruction de la ville ennemie accorde la victoire au joueur, et l'honneur.<br> Beaucoup d'honneur. 

## Comment jouer ?
  Le jeu se joue exclusivement en 1 VS 1, contre un joueur humain.<br>
  Connecter vous au serveur **http://zerdnamac.tk/dagame/client** (nom temporaire), et attendez la connexion d'un  deuxième joueur.<br>
  Quand deux joueurs sont réunis, la partie commence.<br>
  Lorsque d'autre joueurs se connectent au serveur, ils entrent en mode spectateur. (Popcorn non fourni).

## Dépendances
- *NodeJS*
- *Socket.IO*

## Aspects techniques
Toute la partie graphique se fait à travers des dessins dans des canvas HTML.<br>
La grande majorité des calculs se font coté client. <br>
Le principe est simple :
  - A la connexion chaque client récupère de la part du serveur les informations nécessaires au démarrage de la partie ( Map, coordonnées de départ sur la map, coordonnées de l'adversaire ...)
  - Ensuite, le client communique régulièrement *l'état* courant du jeu avec le serveur (plusieurs fois par secondes), lequel met à jour ses variables personnelles, et relaie à l'autre client ces informations. Ainsi, les deux clients sont en permanence à jour l'un avec l'autre. 
Le pathfinding est géré par des workers pour ne pas interrompre le déroulement de la boucle de jeu principale.

## Points à améliorer
Le Pathfinding bien que fonctionnel est encore assez lent pour une gestion en temps réel sur une plus grande carte.<br>
Il n'y a pas assez de contenu.<br>
Il n'y a pas d'animation de mort ou d'attaque implémentées encore, mais celle-ci sont dessinées.<br>
Les unités mortes au combat ne disparaissent pas. (Ça laisse des odeurs ..).<br>
Améliorer la cohérence du jeu sur son contenu.<br>
Corriger le mode spectateur, qui ne marche pas.<br>
Mettre un cout de recrutement, et d'entretien aux unités.<br>
Afficher les informations sur les batiments et unités recrutés (pour la modique somme de 0 PO), sur l'interface avant de les construire.<br>
Intégration d'une miniMap<br>
Ajouter des affichages pour que le jeu soit plus explicite <br>
Intégration d'un affichage des évenements important + chat <br>
Ajout de la construction de plusieurs villes <br>
Intégration de plus de joueurs <br>
Rassembler les classes Unit et Town en un classe mère Entity<br>
Corriger les quelques bug qui reste.<br>

Ajouter au moins un lama de combat <br>

## Répartition des tâches
##### Walid :
  - Gestion de projet
  - Création interface
  - Développement moteur de jeu
  
##### Alexandre :
  - Gestion des graphismes
  - Gestion des animations

##### Pierre :
  - Algorithme de pathfinding
  - NodeJS / SocketIO
  
## Inspiration
Nous nous sommes inspiré du jeu **KOHAN : Battle of Ahriman**<br>
*http://www.jeuxvideo.com/jeux/pc/00008433-kohan-battles-of-ahriman.htm*

## Aides
*http://html5.litten.com/using-multiple-html5-canvases-as-layers/*<br>
*http://jsfiddle.net/gfcarv/QKgHs/*<br>
*https://gamedev.stackexchange.com/a/47401*<br>