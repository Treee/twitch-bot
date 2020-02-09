import { EmoteParser, ComboType } from "./emote-parser";

const parsableEmotes = ["itsatrEeCool", "itsatrEeToast", "itsatrEeMad", "itsatrEee2", "itsatrEeTeee", "HahaSleep", "HahaThink", "HahaTurtledove", "HahaBaby", "HahaDoge", "HahaHide", "HahaSweat", "HahaCat", "HahaLean", "HahaShrugRight", "HahaShrugMiddle", "HahaDreidel", "HahaShrugLeft", "HahaBall", "HahaNyandeer", "Haha2020", "HahaThisisfine", "HahaPoint", "HahaReindeer", "HahaElf", "HahaNutcracker", "HahaGoose", "HahaGingercat", "PrideWingL", "PrideWingR", "PrideShine", "PrideCheers", "PrideBalloons", "PrideLionHey", "PrideLionYay", "RPGBukka", "RPGFei", "RPGGhosto", "RPGStaff", "RPGYonger", "RPGEpicStaff", "PorscheWIN", "SingsNote", "SingsMic", "TwitchSings", "SoonerLater", "HolidayTree", "HolidaySanta", "HolidayPresent", "HolidayOrnament", "HolidayLog", "HolidayCookie", "GunRun", "PixelBob", "FBPenalty", "FBChallenge", "FBCatch", "FBBlock", "FBSpiral", "FBPass", "FBRun", "GenderFluidPride", "NonBinaryPride", "MaxLOL", "IntersexPride", "TwitchRPG", "PansexualPride", "AsexualPride", "TransgenderPride", "GayPride", "LesbianPride", "BisexualPride", "PinkMercy", "MercyWing2", "MercyWing1", "PartyHat", "EarthDay", "TombRaid", "PopCorn", "FBtouchdown", "PurpleStar", "GreenTeam", "RedTeam", "TPFufun", "TwitchVotes", "DarkMode", "HSWP", "HSCheers", "PowerUpL", "PowerUpR", "LUL", "EntropyWins", "TPcrunchyroll", "TwitchUnity", "Squid4", "Squid3", "Squid2", "Squid1", "CrreamAwk", "CarlSmile", "TwitchLit", "TehePelo", "TearGlove", "SabaPing", "PunOko", "KonCha", "Kappu", "InuyoFace", "BigPhish", "BegWan", "ThankEgg", "MorphinTime", "BlessRNG", "TheIlluminati", "TBAngel", "MVGame", "NinjaGrumpy", "PartyTime", "RlyTho", "UWot", "YouDontSay", "KAPOW", "ItsBoshyTime", "CoolStoryBob", "TriHard", "SuperVinlin", "FreakinStinkin", "Poooound", "CurseLit", "BatChest", "BrainSlug", "PrimeMe", "StrawBeary", "RaccAttack", "UncleNox", "WTRuck", "TooSpicy", "Jebaited", "DogFace", "BlargNaut", "TakeNRG", "GivePLZ", "imGlitch", "pastaThat", "copyThis", "UnSane", "DatSheffy", "TheTarFu", "PicoMause", "TinyFace", "DrinkPurple", "DxCat", "RuleFive", "VoteNay", "VoteYea", "PJSugar", "DoritosChip", "OpieOP", "FutureMan", "ChefFrank", "StinkyCheese", "NomNom", "SmoocherZ", "cmonBruh", "KappaWealth", "MikeHogu", "VoHiYo", "KomodoHype", "SeriousSloth", "OSFrog", "OhMyDog", "KappaClaus", "KappaRoss", "MingLee", "SeemsGood", "twitchRaid", "bleedPurple", "duDudu", "riPepperonis", "NotLikeThis", "DendiFace", "CoolCat", "KappaPride", "ShadyLulu", "ArgieB8", "CorgiDerp", "HumbleLife", "PraiseIt", "TTours", "mcaT", "NotATK", "HeyGuys", "Mau5", "PRChase", "WutFace", "BuddhaBar", "PermaSmug", "panicBasket", "BabyRage", "HassaanChop", "TheThing", "EleGiggle", "RitzMitz", "YouWHY", "PipeHype", "BrokeBack", "ANELE", "PanicVis", "GrammarKing", "PeoplesChamp", "SoBayed", "BigBrother", "Keepo", "Kippa", "RalpherZ", "TF2John", "ThunBeast", "WholeWheat", "DAESuppy", "FailFish", "HotPokket", "4Head", "ResidentSleeper", "FUNgineer", "PMSTwin", "PogChamp", "ShazBotstix", "BibleThump", "AsianGlow", "DBstyle", "BloodTrail", "HassanChop", "OneHand", "FrankerZ", "SMOrc", "ArsonNoSexy", "PunchTrees", "SSSsss", "Kreygasm", "KevinTurtle", "PJSalt", "SwiftRage", "DansGame", "GingerPower", "BCWarrior", "MrDestructoid", "JonCarnage", "Kappa", "RedCoat", "TheRinger", "StoneLightning", "OptimizePrime", "JKanStyle", "R-?\\)", "\\;-?(p|P)", "\\:-?(p|P)", "\\;-?\\)", "\\:-?[\\\\/]", "\\&lt\\;3", "\\:-?(o|O)", "B-?\\)", "[oO](_|\\.)[oO]", "\\:-?[z|Z|\\|]", "\\&gt\\;\\(", "\\:-?D", "\\:-?\\(", "\\:-?\\)", "\\;-?\\)", "B-?\\)", "\\:-?\\)", "\\&gt\\;\\(", "[oO](_|\\.)[oO]", "\\:-?D", "\\:-?(S|s)", "\\:-?[z|Z|\\|]", "\\:-?[\\\\/]", "\\:-?(o|O)", "\\;-?(p|P)", "\\:-?(p|P)", "\\:-?\\(", ":-?(?:7|L)", "\\&lt\\;\\]", "\\:\\&gt\\;", "#-?[\\\\/]", "R-?\\)", "\\&lt\\;3", "PokScizor", "PokEmpoleon", "PokDecidueye", "PokDarkrai", "PokBlastoise", "FortLlama", "FortHype", "FortBush", "FortOne", "PokShadowmew", "PokSceptile", "PokGarchomp", "PokChandelure", "PokBraixen", "PokAegislash", "PokWeavile", "PokSuicune", "PokPikachu", "PokMewtwo", "PokMaskedpika", "PokMachamp", "PokLucario", "PokCroagunk", "PokGengar", "PokGardevoir", "PokCharizard", "PokBlaziken", "TwitchCop", "PartyPopper", "MindManners", "BagOfMemes", "PrimeRlyTho", "PrimeUWot", "PrimeYouDontSay", "MiniK", "KappaHD", "ScaredyCat", "TableHere", "FlipThis", "PrideCheers", "itsatreeLurk", "itsatreeRekt", "itsatreeHi", "itsatreeCop", "itsatreeWot", "itsatreeVibe", "itsatreeFriends", "fgpGasm", "RareChar", "Woah", "SnoopPls", "BongoCat", "Gir", "PikaFacepalm", "OkMan", "TinaB", "stichDance", "MYEYES", "Giggity", "FeelsBufferingMan", "SnoopSamus", "VaanSmashing", "Train", "HeyListen", "KrabbyPatty", "KoalaTea", "PikachuShock", "Crabrave", "TeaTime", "HAMDANCE", "PedoBear", "RebeccaBlack", ":tf:", "CiGrip", "DatSauce", "ForeverAlone", "GabeN", "HailHelix", "HerbPerve", "iDog", "rStrike", "ShoopDaWhoop", "SwedSwag", "M&Mjc", "bttvNice", "TopHam", "TwaT", "WatChuSay", "SavageJerky", "Zappa", "tehPoleCat", "AngelThump", "HHydro", "TaxiBro", "BroBalt", "ButterSauce", "BaconEffect", "SuchFraud", "CandianRage", "She'llBeRight", "D:", "VisLaud", "KaRappa", "YetiZ", "miniJulia", "FishMoley", "Hhhehehe", "KKona", "PoleDoge", "sosGame", "CruW", "RarePepe", "iamsocal", "haHAA", "FeelsBirthdayMan", "RonSmug", "KappaCool", "FeelsBadMan", "BasedGod", "bUrself", "ConcernDoge", "FeelsGoodMan", "FireSpeed", "NaM", "SourPls", "LuL", "SaltyCorn", "FCreep", "monkaS", "VapeNation", "ariW", "notsquishY", "FeelsAmazingMan", "DuckerZ", "SqShy", "Wowee", "WubTF"];

describe('Emote Parser', () => {

    let emoteParser: EmoteParser;

    beforeEach(() => {
        emoteParser = new EmoteParser();
    });

    describe('parseComplete', () => {
        it('returns a list of emotes and combo emotes used', () => {
            const expectedResult = [
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] },
            ];
            const msg = 'Squid1 Squid2 Squid3 Squid4';
            const actualResult = emoteParser.parseComplete(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('returns the correct emote when found in chat', () => {
            const expectedResult = [
                { type: ComboType.None, data: ['itsatrEeToast'] }
            ];
            const msg = 'itsatrEeToast';
            const actualResult = emoteParser.parseComplete(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });


        it('returns the correct emote when found in chat with channel point modifier', () => {
            const expectedResult = [
                { type: ComboType.None, data: ['itsatrEeToast_HB'] }
            ];
            const msg = 'itsatrEeToast_HB';
            const actualResult = emoteParser.parseComplete(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });


    });

    describe('parseForEmotes', () => {
        it('returns a list of all matched emotes in a message that contain special emote suffixes', () => {
            const msg = 'some random text with FeelsAmazingMan_SA';
            const expectedResult = [
                ['FeelsAmazingMan_SA']
            ];
            const actualResult = emoteParser.parseForEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('returns a list of all matched emotes in a message', () => {
            const msg = 'some random text with notsquishY';
            const expectedResult = [
                ['notsquishY']
            ];
            const actualResult = emoteParser.parseForEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('returns an empty list if no words in the message match emote codes', () => {
            const msg = 'some random text with emoteCode';
            const expectedResult: string[][] = [];
            const actualResult = emoteParser.parseForEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
    });

    describe('checkForComboEmotes', () => {

        it('can find a sequence of emotes  that combo together', () => {
            const expectedResult = [
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] }
            ];
            const msg = 'my custom emote msg Squid1 Squid2 Squid3 Squid4';
            const actualResult = emoteParser.checkForComboEmotes(msg, []);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find multiple sequences of emotes that combo together', () => {
            const expectedResult = [
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] },
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] },
            ];
            const msg = 'my custom emote msg Squid1 Squid2 Squid3 Squid4 Squid1 Squid2 Squid3 Squid4';
            const actualResult = emoteParser.checkForComboEmotes(msg, []);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find a sequence of emotes that are on the left and right', () => {
            const expectedResult = [
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] }
            ];
            const msg = 'my custom emote msg PowerUpL itsatrEeToast PowerUpR';
            const actualResult = emoteParser.checkForComboEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find a sequence of emotes that are on the left and right using special suffixes', () => {
            const expectedResult = [
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast_SA', 'PowerUpR'] }
            ];
            const msg = 'my custom emote msg PowerUpL itsatrEeToast_SA PowerUpR';
            const actualResult = emoteParser.checkForComboEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find multiple sequences of emotes that are on the left and right', () => {
            const expectedResult = [
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] },
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] }
            ];
            const msg = 'my custom emote msg PowerUpL itsatrEeToast PowerUpR PowerUpL itsatrEeToast PowerUpR';
            const actualResult = emoteParser.checkForComboEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
    });

});