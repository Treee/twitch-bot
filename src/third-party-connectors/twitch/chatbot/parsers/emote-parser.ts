export enum ComboType {
    None, Sequence, LeftRight
}

class ComboEmote {
    comboType: ComboType;
    combo: string[];

    constructor(comboType: ComboType, combo: string[]) {
        this.comboType = comboType;
        this.combo = combo;
    }
}

export class EmoteParser {
    private emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
    comboCodes: ComboEmote[] = [
        new ComboEmote(ComboType.Sequence, ['Squid1', 'Squid2', 'Squid3', 'Squid4']),
        new ComboEmote(ComboType.LeftRight, ['PowerUpL', 'PowerUpR'])
    ];
    constructor() { }

    parseComplete(msg: string, parsableEmotes: string[]): any[] {
        let foundEmotes: any[] = [];
        this.checkForComboEmotes(msg, parsableEmotes).forEach((emote) => {
            foundEmotes.push(emote);
        });
        this.parseForEmotes(msg, parsableEmotes).forEach((emote) => {
            foundEmotes.push({ type: ComboType.None, data: emote });
        });
        return foundEmotes;
    }

    parseForEmotes(msg: string, parsableEmotes: string[]): string[][] {
        const validEmotes = parsableEmotes.join('|');
        const validSuffixes = this.emoteSuffixes.join('|');
        const regex = new RegExp(`(${validEmotes})(${validSuffixes})?`, 'gi');
        let comboEmotes: string[][] = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            if (matches) {
                comboEmotes.push(matches);
            }
        }
        return comboEmotes;
    }

    checkForComboEmotes(msg: string, parsableEmotes: string[]): any[] {
        let comboEmotes: any[] = [];
        const validMiddles = parsableEmotes.join('|');
        this.comboCodes.forEach((comboEmote: ComboEmote) => {
            const sequentialCombo = this.checkForSequentialEmotes(msg, comboEmote);
            if (sequentialCombo.length > 0) {
                sequentialCombo.forEach((combo) => {
                    comboEmotes.push({ type: ComboType.Sequence, data: combo });
                });
            }

            const leftRightCombo = this.checkForLeftRightEmotes(msg, comboEmote, validMiddles);
            if (leftRightCombo.length > 0) {
                leftRightCombo.forEach((combo) => {
                    comboEmotes.push({ type: ComboType.LeftRight, data: combo });
                });
            }
        });
        return comboEmotes;
    }

    checkForLeftRightEmotes(msg: string, comboEmote: ComboEmote, validMiddles: string): string[][] {
        const validSuffixes = this.emoteSuffixes.join('|');
        const regex = new RegExp(`${comboEmote.combo[0]} (${validMiddles})(${validSuffixes})? ${comboEmote.combo[1]}`, 'gi');
        let comboEmotes: string[][] = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            matches?.forEach((match: string) => {
                comboEmotes.push(match.split(' '));
            });
        }
        return comboEmotes;
    }

    checkForSequentialEmotes(msg: string, comboEmote: ComboEmote): string[][] {
        const regex = new RegExp(`${comboEmote.combo.join(' ')}`, 'gi');
        let comboEmotes: string[][] = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            matches?.forEach((match: string) => {
                comboEmotes.push(match.split(' '));
            });
        }
        return comboEmotes;
    }
}