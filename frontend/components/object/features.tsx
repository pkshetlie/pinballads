const schema = {
    pinsound: {
        blaster: false,
        invision: false,
        sonataSpk: false,
        noMoreReset: false,
        headphoneStationUltra: false,
        headphoneStationMaster: false,
        motionControlShakerKit: false,
        subwooferAndLineOutConnector: false,
    },
    dmd: {
        xl: false,
        color: false,
    },
    cabinet: {
        artBlade: false,
        mirrorBlade: false,
        fullLed: false,
        sternInsider: false,
        mods: false,
        playfieldProtector: false,
        coinAcceptor: false,
        antiReflectiveGlass: false,
    },
    other: {
        coverMate: false,
        // numberOfPlayers: 4,
        officialTopper: false,
        customTopper: false,
        HomeUseOnly: false,
        manual: false,
        goodies: false,
    }
};

export type featuresType = typeof schema;
export const defaultFeatures: featuresType = schema;
