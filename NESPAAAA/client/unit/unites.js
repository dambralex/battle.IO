var Unites = {
      "archer" : {
        "nombre" : 6,
        "vitesse_deplacement" : 50,
        "vitesse_attaque" : 1,
        "points_vie" : 300,
        "est_unite_distance" : true,
        "portée_attaque" : 1,
        "champs_de_vision" : 5,
        "moral" : 50,
        "armure" : 5,
        "resistance_magie" : 5,
        "points_magie" : 0,
        "degats_magie" : 0,
        "est_unite_magique" : false,

        "cout_recrutement" : 20,

        //modif by Alex
        "image_walk" : {
          "anim_path" : "./sprites/jeu/unites/human/archer/walk",
          img_size_x : 464,
          img_size_y : 584,
          sprite_size_x : 58,
          sprite_size_y : 73,
          nb_anim :8,
          },
        "image_death" : {
          "anim_path" : "./sprites/jeu/unites/human/archer/death",
          img_size_x : 173,
          img_size_y : 584,
          sprite_size_x : 58,
          sprite_size_y : 73,
          nb_anim :3,
          },
        "image_hit" : {
          "anim_path" : "./sprites/jeu/unites/human/archer/hit",
          img_size_x : 116,
          img_size_y : 584,
          sprite_size_x : 58,
          sprite_size_y : 73,
          nb_anim :2,
          },
        //done
      },
      "lancers" : {
        "nombre" : 6,
        "vitesse_deplacement" : 2,
        "vitesse_attaque" : 1,
        "points_vie" : 50,
        "est_unite_distance" : false,
        "portée_attaque" : 2,
        "champs_de_vision" : 50,
        "moral" : 70,
        "armure" : 20,
        "resistance_magie" : 20,
        "points_magie" : 0,
        "degats_magie" : 0,
        "est_unite_magique" : false,

        "cout_recrutement" : 50
      },
      "sword" : {
        "nombre" : 6,
        "vitesse_deplacement" : 2,
        "vitesse_attaque" : 2,
        "points_vie" : 50,
        "est_unite_distance" : false,
        "portée_attaque" : 5,
        "champs_de_vision" : 3,
        "moral" : 70,
        "armure" : 40,
        "resistance_magie" : 30,
        "points_magie" : 0,
        "degats_magie" : 0,
        "est_unite_magique" : false,

        "cout_recrutement" : 70,

        //modif by Alex
        "anim_path" : "unites/human/swordman"
      },
      "knight" : {
        "nombre" : 3,
        "vitesse_deplacement" : 100,
        "vitesse_attaque" : 5,
        "points_vie" : 450,
        "est_unite_distance" : false,
        "portée_attaque" : 2,
        "champs_de_vision" : 7,
        "moral" : 100,
        "armure" : 50,
        "resistance_magie" : 50,
        "points_magie" : 0,
        "degats_magie" : 0,
        "est_unite_magique" : false,

        "cout_recrutement" : 100,

        //modif by Alex //C'EST A TERMINER!
        "image_walk" : {
          "anim_path" : "./sprites/jeu/unites/human/knight/walk",
          img_size_x : 370,
          img_size_y : 592,
          sprite_size_x : 74,
          sprite_size_y : 74,
          nb_anim :5,
          },
        "image_death" : {
          "anim_path" : "./sprites/jeu/unites/human/knight/death",
          img_size_x : 370,
          img_size_y : 592,
          sprite_size_x : 74,
          sprite_size_y : 74,
          nb_anim :5,
          },
        "image_hit" : {
          "anim_path" : "./sprites/jeu/unites/human/knight/hit",
          img_size_x : 296,
          img_size_y : 592,
          sprite_size_x : 74,
          sprite_size_y : 74,
          nb_anim :4,
          },
        //done
      }
}
var Towns = {
      "niveau" : [
        {
          "grade" : 1,
          "production" : 2000,
          "cout" : 0,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },
          "points_vie" : 600,
          "emplacements_construction" : 2,
          "temps_upgrade" : 0,

          //modif by Alex
          "bat_img" : 1,
          //done
        },
        {
          "grade" : 2,
          "production" : 2000,
          "cout" : 200,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },
          "points_vie" : 700,
          "emplacements_construction" : 4,
          "temps_upgrade" : 2,

          //modif by Alex
          "bat_img" : 1,
          //done
        },
        {
          "grade" : 3,
          "production" : 3000,
          "cout" : 400,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },
          "points_vie" : 800,
          "emplacements_construction" : 5,
          "temps_upgrade" : 5,

          //modif by Alex
          "bat_img" : 2,
          //done
        },
        {
          "grade" : 4,
          "production" : 4000,
          "cout" : 600,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },
          "points_vie" : 900,
          "emplacements_construction" : 5,
          "temps_upgrade" : 8,

          //modif by Alex
          "bat_img" : 2,
          //done
        },
        {
          "grade" : 5,
          "production" : 5000,
          "cout" : 800,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },
          "points_vie" : 1000,
          "emplacements_construction" : 6,
          "temps_upgrade" : 10,

          //modif by Alex
          "bat_img" : 3,
          //done
        }
      ],

      "batiments" : {
        "carriere" : {
          "production" : 2000,
          "cout" : 225,
          "apports" : {
            pierre : 150,
            bois : 0,
            fer : 0,
            or : 0 
          },

          //modif by Alex
          "anim_path" : "construction/carriere",
          "img_size_x" : 38,
          "img_size_y" : 38,
          "sprite_size_x" : 38,
          "sprite_size_y" : 38,
          "nb_anim" :1,
          //done

          "evolution" : {
            "nom": "carriere_amelioree",
            "production" : 3000,
            "cout" : 400,
            "apports" : {
            pierre : 300,
            bois : 0,
            fer : 0,
            or : 10 
          }
        }
      },
        "scierie" : {
          "production" : 2500,
          "cout" : 100,
          "apports" : {
            pierre : 0,
            bois : 100,
            fer : -10,
            or : -10 
          },

          //modif by Alex
          "anim_path" : "construction/scierie",
          "img_size_x" : 38,
          "img_size_y" : 38,
          "sprite_size_x" : 38,
          "sprite_size_y" : 38,
          "nb_anim" :1,
          //done

          "evolution" : {
            "nom": "scierie_amelioree",
            "production" : 3000,
            "cout" : 400,
            "apports" : {
              pierre : 0,
              bois : 250,
              fer : -3,
              or : 0 
            }
          }
        },
        "mine" : {
          "production" : 1000,
          "cout" : 300,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 100,
            or : 0 
          },

          //modif by Alex
          "anim_path" : "construction/mine",
          "img_size_x" : 38,
          "img_size_y" : 38,
          "sprite_size_x" : 38,
          "sprite_size_y" : 38,
          "nb_anim" :1,
          //done
          
          "evolution" : {
            "nom": "mine_amelioree",
            "production" : 3000,
            "cout" : 400,
            "apports" : {
              pierre : 0,
              bois : -2,
              fer : 300,
              or : 15 
            }
          }
        },
        "bank" : {
          "production" : 1000,
          "cout" : 300,
          "apports" : {
            pierre : -1,
            bois : -1,
            fer : -5,
            or : -2 
          },

          //modif by Alex
          "anim_path" : "construction/bank",
          "img_size_x" : 38,
          "img_size_y" : 38,
          "sprite_size_x" : 38,
          "sprite_size_y" : 38,
          "nb_anim" :1,
          //done
        },
        "caserne" : {
          "production" : 1500,
          "cout" : 400,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },


          //modif by Alex
          "anim_path" : "construction/caserne",
          "img_size_x" : 38,
          "img_size_y" : 38,
          "sprite_size_x" : 38,
          "sprite_size_y" : 38,
          "nb_anim" :1,
          //done
          
          "unites" : [
            "archers",
            "lanciers"
          ],
          "evolution" : {
            "nom": "caserne_amelioree",
            "unites" : [
              "archers",
              "lanciers",
              "epees"
            ],
            "cout" : 1000,
            "apports" : {
              pierre : 0,
              bois : 0,
              fer : 0,
              or : 0 
            }
          }
        },
        "ecurie" : {
          "production" : 1200,
          "cout" : 600,
          "apports" : {
            pierre : 0,
            bois : 0,
            fer : 0,
            or : 0 
          },

          //modif by Alex
          "anim_path" : "construction/ecurie",
          "img_size_x" : 38,
          "img_size_y" : 38,
          "sprite_size_x" : 38,
          "sprite_size_y" : 38,
          "nb_anim" :1,
          //done
          
          "unites" : [
            "cavaliers"
          ]
        }
      }
    }
  
