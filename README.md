# battle.IO
## Auteurs 
  Walid Birjam, Alexandre D'Ambra, Pierre Tinland
  
## Règles
  Battle.io est un jeu de stratégie en temps réel, en 1 VS 1.
  Le but du jeu est de développer votre ville de façon à avoir le maximum de ressources, et pouvoir recruter les troupes nécessaires
  à la défense de votre ville, et à la destruction de celle de l'adversaire.
  La destruction de la ville ennemie accorde la victoire au joueur.

## Comment jouer ?
  Le jeu se joue exclusivement en 1 VS 1, contre un joueur humain.
  Connecter vous au serveur **http://zerdnamac.tk/dagame**, et attendez la connexion d'un  deuxième joueur.
  Quand deux joueurs sont réunis, la partie commence.

## Dépendances
*NodeJS*
*Socket.IO*

## Aspects techniques
La grande majorité des calculs se font coté clients. 
Le principe est simple :
  - A la connexion chaque client récupère de la part du serveur les informations nécessaire au démarrage de la partie ( Map, coordonnés de départ sur la map, coordonnées de l'adversaire ...)
  - Ensuite, le client communique régulièrement *l'état* courant du jeu avec le serveur (plusieurs fois par secondes), lequel mets à jour ses variables personnelles, et relaie à l'autre client ces informations. Ainsi, les deux clients sont en permanence à jour l'un avec l'autre. 


## Répartition des tâches

