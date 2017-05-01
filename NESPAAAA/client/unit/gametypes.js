
Types = {
    Messages: {
    },
    
    Entities: {

        // Units
        WARRIOR: 1,
        ARCHER: 2,
        KNIGHT: 3,

        ORCWARRIOR: 4,
        ORCARCHER: 5,
        ORCKNIGHT: 6,

        // Squads
        SQUAD: 7,

        //Town
        TOWN: 8,
        ORCTOWN: 9

    },

    Races: {
        HUMAN: 1,
        ORC: 2
    },
    
    Orientations: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    }
};

var kinds = {
    warrior: [Types.Entities.WARRIOR, "unit"],
    archer: [Types.Entities.ARCHER, "unit"],
    knight: [Types.Entities.KNIGHT, "unit"],

    squad: [Types.Entities.SQUAD, "squad"],

    town: [Types.Entities.TOWN, "town"],
};