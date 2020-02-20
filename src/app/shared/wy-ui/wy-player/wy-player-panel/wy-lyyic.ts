import { Lyric } from 'src/app/services/data-type/common.types';

const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export interface BasicLyricLine {
    txt: string;
    txtCn: string;
}

interface LyricLine extends BasicLyricLine {
    time: number;
}

export class WyLyric {

    lines: LyricLine[] = [];
    constructor(private lrc: Lyric) {
        this.init();
    }

    private init() {
        if (this.lrc.tlyric) {
            this.generTLyric();
        } else {
            this.generLyric();
        }

    }

    private generLyric() {
        console.log('lrc', this.lrc.lyric);
        const lines = this.lrc.lyric.split('\n'); // 分割数组

        lines.forEach(line => this.makeLine(line));

        console.log('lines---->', this.lines);

    }

    private generTLyric() {

    }

    private makeLine(line: string) {
        const result = timeExp.exec(line);
        console.log('result', result);
        if (result) {
            const txt = line.replace(timeExp, '').trim();
            const txtCn = '';
            if (txt) {
                const thirdResult = result[3] || '00';
                const len = thirdResult.length;
                const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10;
                const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
                this.lines.push({ txt, txtCn, time });
            }
        }
    }
}