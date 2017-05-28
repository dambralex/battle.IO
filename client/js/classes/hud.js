class Hud{
    constructor(){
        this.show = null;
        this.buttonPressed = null;
        this.errorMessage ="";
        this.errorMessageTimer = new Timer();
    
        this.constructionButtons = [];
        this.controlButtons = [];
        this.constructionChoice = [];
    }

    init(){
        var button;
    
        for(var c = 0; c < 7; c++){
            button = new Button("libre", c*50 + 320, 30);
            button.setOnClick(function(){
                if(this.text != "libre"){
                    this.unpress();
                }
            });

            button.setDescription(
                "Emplacement libre pour construire un batiment dans la ville");
            button.setStats("Cliquez pour construire");

            this.constructionButtons.push(button);
        }
    
        button = new Button("Mélée", 700, 30);
    
        button.setOnClick(function(){
            new Unit(null, that.player, kinds.archer, that.selectedEntities.town.posX+that.selectedEntities.town.width/2,
                                       that.selectedEntities.town.posY+that.selectedEntities.town.height +20);
        });

        button.setDescription("Créer une unité de mélée");
        button.setStats("Cout : "+Unites["archer"]["cout_recrutement"]+" ");
        button.addStats("Force : "+Unites["archer"]["force"]+" ");
        button.addStats("Armure : "+Unites["archer"]["armure"]+" ");
        button.addStats("PdV : "+Unites["archer"]["points_vie"]);

        this.controlButtons.push(button);

    
        button = new Button("chevaliers", 750, 30);
    
        button.setOnClick(function(){
            new Unit(null, that.player, kinds.knight, that.selectedEntities.town.posX+that.selectedEntities.town.width/2,
                                       that.selectedEntities.town.posY+that.selectedEntities.town.height +20);
        });
        button.setDescription("Créer un cavalier de mélée. Elle est supérieur à une unité simple de mélée");
        button.setStats("Cout : "+Unites["knight"]["cout_recrutement"]+" ");
        button.addStats("Force : "+Unites["knight"]["force"]+" ");
        button.addStats("Armure : "+Unites["knight"]["armure"]+" ");
        button.addStats("PdV : "+Unites["knight"]["points_vie"]);

    
        this.controlButtons.push(button);
        var chemin = "./sprites/hud/construction/";
        var x = 320;
    
        var path;
    
        for(name in Towns["batiments"]){
    
            path = chemin + name + "_.png";
            button = new Button(name, x, 80, path);
    
            button.setOnClick(function(){
                that.selectedEntities.town.buildConstruction(this.text);
            });

            button.setDescription(Towns["batiments"][name]["description"]);
            button.setStats("Cout : "+Towns["batiments"][name]["cout"]+" ");
            button.addStats("Pierre : "+Towns["batiments"][name]["apports"].pierre+" ");
            button.addStats("Bois : "+Towns["batiments"][name]["apports"].bois+" ");
            button.addStats("Fer : "+Towns["batiments"][name]["apports"].fer+" ");
            button.addStats("Or : "+Towns["batiments"][name]["apports"].or);
            button.addStats("\nTemps de construction : "+Towns["batiments"][name]["production"]/1000+" s");

            this.constructionChoice.push(button);
    
            x = x + 50;
        }
    
        button = new Button("amélioration", 320, 130);
    
        button.setOnClick(function(){
            if ( that.selectedEntities.town.construction.length ==  Towns["niveau"][that.selectedEntities.town.stage]["emplacements_construction"]){
                console.log(Towns["niveau"][that.selectedEntities.town.stage]["emplacements_construction"] + "batiments sur"+that.selectedEntities.town.construction.length +", construction d'une base plus grande, nouveau stage : " + that.selectedEntities.town.stage +1);
                that.selectedEntities.town.upgrade();
                if(Towns["niveau"][that.selectedEntities.town.stage+1]){
                    button.setDescription(Towns["niveau"][that.selectedEntities.town.stage+1]["description"]);
                    button.setStats("Cout : "+Towns["niveau"][that.selectedEntities.town.stage+1]["cout"]+" ");
                    button.addStats("Pierre : "+Towns["niveau"][that.selectedEntities.town.stage+1]["apports"].pierre+" ");
                    button.addStats("Bois : "+Towns["niveau"][that.selectedEntities.town.stage+1]["apports"].bois+" ");
                    button.addStats("Fer : "+Towns["niveau"][that.selectedEntities.town.stage+1]["apports"].fer+" ");
                    button.addStats("Or : "+Towns["niveau"][that.selectedEntities.town.stage+1]["apports"].or+"\n");
                    button.addStats("Temps de construction : "+Towns["niveau"][that.selectedEntities.town.stage+1]["production"]/1000+" seconde");
                }
                else{
                    button.setDescription("Déjà au niveau maximum");
                    button.setStats("");
                }
            }
            else{
                console.log(Towns["niveau"][that.selectedEntities.town.stage]["emplacements_construction"] + "batiments sur"+that.selectedEntities.town.construction.length +" : il faut plus de batiments");
                console.log(Towns["niveau"]);
                that.sendError("Il reste un emplacement de batiments libre. Vous ne pouvez pas améliorer votre ville");
            }
        });

        button.setDescription(Towns["niveau"][1]["description"]);
        button.setStats("Cout : "+Towns["niveau"][1]["cout"]+" ");
        button.addStats("Pierre : "+Towns["niveau"][1]["apports"].pierre+" ");
        button.addStats("Bois : "+Towns["niveau"][1]["apports"].bois+" ");
        button.addStats("Fer : "+Towns["niveau"][1]["apports"].fer+" ");
        button.addStats("Or : "+Towns["niveau"][1]["apports"].or+"\n");
        button.addStats("Temps de construction : "+Towns["niveau"][1]["production"]+"seconde");
    
        this.controlButtons.push(button);
    }
    draw(context){
        this.drawMainControl(context);
        this.drawMiniMap(context);
    }
    
    drawMainControl(context){
        context.save();
        context.fillStyle = '#AAAAAA';
        context.fillRect(300, 0, context.canvas.width - 300, 200);
    
        if(that.selectedEntities.unit.length <= 0){
            if(that.selectedEntities.town != null){
                this.drawTown(context);
            }
        }
        else {
            this.drawUnits(context);
            this.forEachButton(function(button){
                button.showButton = false;
            });
        }
        
        if(that.player){
            this.drawPlayerResources(context);
        }

        this.drawPopCount(context);
        this.drawError(context);
    
        context.restore();
    }
    
    drawMiniMap(context){
        context.save();
        context.fillRect(0, 0, 300, 200);
        context.restore();
    }
    
    drawUnits(context){
        var nb = that.selectedEntities.unit.length;
        var box_width = (context.canvas.width - 300) / nb;
        context.save();
        var is_friend = 0;
        var x = 320;
        var y = 30;
        var z = 0;
        context.fillStyle = 'black';
        context.font = "10pt Arial";
        for( var i in that.selectedEntities.unit){
          if(that.player === that.selectedEntities.unit[i].player) is_friend = 1;
        }
    
        for(var i in that.selectedEntities.unit){
          if(i == 10) { x = 500; z = 0; }
          else if(i == 20) { x = 700; z = 0;}
          else if(i == 30) { x = 900; z = 0;}
          if(is_friend)
          {
            if(that.player === that.selectedEntities.unit[i].player){
              context.fillText("Unité " + i
                              + "   PV : " + that.selectedEntities.unit[i].hitPoints
                              + " / " + that.selectedEntities.unit[i].maxHitPoints
                              , x, y + z * 15);
              z++;
            }
          }
          else {
            context.fillText("Unité " + z
                            + "    PV : " + that.selectedEntities.unit[i].hitPoints
                            + " / " + that.selectedEntities.unit[i].maxHitPoints
                            , x, y + z * 15);
            z++;
          }
        }
        context.restore();
    }

    drawTown(context){
        context.save();
        context.fillStyle = 'black';
        context.font = "10pt Arial";
        context.fillText(that.selectedEntities.town.name, 320, 20);
        context.fillText("Stone : "+that.selectedEntities.town.stone+" "+
                         "Wood : "+that.selectedEntities.town.wood+" "+
                         "Iron : "+that.selectedEntities.town.iron+" "+
                         "Income : "+that.selectedEntities.town.income, 600, 20);
        context.fillText(that.selectedEntities.town.hitPoints+"/"+that.selectedEntities.town.maxHitPoints, 450, 20);
    
        context.restore();
    
        if(that.selectedEntities.town.player == that.player){
            this.drawButtonInformation(context);
            this.drawTownConstruction(context);
            this.drawTownControl(context);
            this.forEachButton(function(button){
                button.draw(context);
            });
            this.drawTownCurrentConstruction(context);
        }
    }
    
    drawTownConstruction(context){
        for(var i in that.selectedEntities.town.construction){
            this.constructionButtons[i].setText(that.selectedEntities.town.construction[i]);
            this.constructionButtons[i].setDescription(Towns["batiments"][this.constructionButtons[i].text]["description"]);
            this.constructionButtons[i].setStats("Pierre : "+Towns["batiments"][this.constructionButtons[i].text]["apports"].pierre+" ");
            this.constructionButtons[i].addStats("Bois : "+Towns["batiments"][this.constructionButtons[i].text]["apports"].bois+" ");
            this.constructionButtons[i].addStats("Fer : "+Towns["batiments"][this.constructionButtons[i].text]["apports"].fer+" ");
            this.constructionButtons[i].addStats("Or : "+Towns["batiments"][this.constructionButtons[i].text]["apports"].or+"\n");
        }
    
        for(var c = 0; c < Towns["niveau"][that.selectedEntities.town.stage]["emplacements_construction"]; c++){
            this.constructionButtons[c].showButton = true;
        }
    }
    
    drawTownControl(context){
        for(var i in this.controlButtons){
            this.controlButtons[i].showButton = true;
        }

        var showConstructionChoice = false;
    
        for(var i in this.constructionButtons){
            if(this.constructionButtons[i].pressed){
                showConstructionChoice = true;
            }
        }
        for(var b in this.constructionChoice){
            this.constructionChoice[b].showButton = showConstructionChoice;
        }
    }
    
    drawPlayerResources(context){
        context.save();
        context.fillStyle = 'black';
        context.font = "10pt Arial";
    
    
        // ajout by alex (ne marche pas : parti sur les batiments a dessiner)
        var pic_stone = new Image();
        var pic_wood = new Image();
        var pic_iron = new Image();
        var pic_income = new Image();
    
        pic_stone.src = './sprites/hud/ressources/stone.png';
        pic_wood.src = './sprites/hud/ressources/wood.png';
        pic_iron.src = './sprites/hud/ressources/iron.png';
        pic_income.src = './sprites/hud/ressources/gold.png';
    
        context.drawImage(pic_stone,0,0,128,128,320,170,128,128);
        context.drawImage(pic_wood,0,0,128,128,470,170,128,128);
        context.drawImage(pic_iron,0,0,128,128,620,170,128,128);
        context.drawImage(pic_income,0,0,128,128,770,167,128,128);
        context.fillText("Stone : "+that.player.stone, 360, 187);
        context.fillText("Wood : "+that.player.wood, 510, 187);
        context.fillText("Iron : "+that.player.iron, 660, 187);
        context.fillText("Gold : "+that.player.gold+"("+that.player.income+")", 810, 187);
        // done (explication : j'ai fait ca en dur, j'aurai pu faire autrement mais c'est pour faire rapide ^^)
    
        context.restore();
    }
    
    handleLeftClick(x, y){
        var buttonPressed = null;

        if(that.selectedEntities.unit.length <= 0){
            if(that.selectedEntities.town != null && that.selectedEntities.town.player == that.player){
                for(var b in this.constructionButtons)
                    this.constructionButtons[b].unpress();

                this.forEachButton(function(button){
                    if(button.showButton && collisionBox({x : x, y : y, w : 0, h : 0}, button.getBoundingBox())){
                        button.press();
                        buttonPressed = button;
                    }
                });
            }
        }
        else {
    
        }

        this.buttonPressed = buttonPressed;
    }

    handleClickUp(){
        if(this.buttonPressed){
            for(var b in this.constructionButtons){
                if(this.buttonPressed == this.constructionButtons[b])
                    return;
            }
            this.buttonPressed.unpress();
            this.buttonPressed = null;
        }
    }

    handleMouseMove(x, y){
        var show = null;

        if(that.selectedEntities.town != null && that.selectedEntities.town.player == that.player){     
            
            this.forEachButton(function(button){
                if(button.showButton && collisionBox({x : x, y : y, w : 0, h : 0}, button.getBoundingBox())){
                    show = button;
                    return;
                }
            });
        }

        this.show = show;
    }

    drawButtonInformation(context){
        if(!this.show)
            return;

        context.save();
        context.fillStyle = 'black';
        context.font = "10pt Arial";
        context.fillText(this.show.text, 900, 50);
        context.fillText(this.show.description, 900, 70);
        context.fillText(this.show.stats, 900, 90);
        context.restore();
    }

    getError(message){
        this.errorMessage = message;
        this.errorMessageTimer = new Timer(2000, Date.now());
    }

    drawError(context){
        if(this.errorMessageTimer.pourcentageOver(Date.now()) < 1){
            context.save();
            context.fillStyle = 'red';
            context.font = "10pt Arial";
            context.fillText(this.errorMessage, 900, 160);
            context.restore();
        }
    }

    drawTownCurrentConstruction(context){
        if(that.selectedEntities.town.isBuilding){
            var pourcent = 0;
            context.save();
            context.fillStyle = 'purple';
            context.font = "8pt Arial";
            context.fillText("Construction en cours", 400, 140);
            context.fillText(that.selectedEntities.town.currentBuilding, 400, 155);
            context.stokeStyle = 'purple';
            context.strokeRect(450, 150, 100, 10);
            pourcent = that.selectedEntities.town.timerConstruction.pourcentageOver(Date.now());
            context.fillRect(450, 150, 100*pourcent, 10);
            context.restore();
        }
    }

    drawPopCount(context){
        context.save();
        context.fillStyle = 'black';
        context.font = "10pt Arial";
        context.fillText("Population : "+that.player.population, 900, 20);
        context.fillText("Ville : "+that.player.townCount, 1050, 20);
        context.restore();

    }

    forEachButton(callback){
        for(var b in this.controlButtons)
            callback(this.controlButtons[b]);
        for(var b in this.constructionChoice)
            callback(this.constructionChoice[b]);
        for(var b in this.constructionButtons)
            callback(this.constructionButtons[b]);
    }
}