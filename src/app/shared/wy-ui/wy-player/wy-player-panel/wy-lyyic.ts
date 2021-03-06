import { Lyric } from 'src/app/services/data-type/common.types';
import { zip, from, Observable, Subject, Subscription, timer } from 'rxjs';
import { skip, timeout } from 'rxjs/operators';

// const timeExp = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/;
const timeExp = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

export interface BasicLyricLine {
    txt: string;
    txtCn: string;
}

interface LyricLine extends BasicLyricLine {
    time: number;
}
interface Handle extends BasicLyricLine {
    lineNum: number;
}
export class WyLyric {

    private playing = false;
    private curNum: number;
    private startStamp: number;
    lines: LyricLine[] = [];
    handle = new Subject<Handle>();

    timer$: Subscription;
    pauseStamp: number;

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
        const lines = this.lrc.lyric.split('\n'); // 分割数组

        lines.forEach(line => this.makeLine(line));

        console.log('lines---->', this.lines);

    }

    private generTLyric() { // 处理双语歌词

        const lines = this.lrc.lyric.split('\n');
        const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);

        // console.log('lines-->', lines);
        // console.log('tlines-->', tlines);


        const moreLine = lines.length - tlines.length;

        let tempArr = [];
        if (moreLine >= 0) {
            tempArr = [lines, tlines];
        } else {
            tempArr = [tlines, lines];
        }

        const first = timeExp.exec(tempArr[1][0])[0]; // 找出最少部分时间
        console.log('first', first);

        const skipIndex = tempArr[0].findIndex(item => { // 找出多的数组中索引位置
            const exec = timeExp.exec(item);
            if (exec) {
                return exec[0] === first;
            }
        });
        console.log('skipIndex-->', skipIndex);

        const _skip = skipIndex === -1 ? 0 : skipIndex;
        const skipItems = tempArr[0].slice(0, _skip);
        console.log('skipItems--->', skipItems);
        if (skipItems.length) {
            skipItems.forEach(line => {
                this.makeLine(line);
            });
        }

        let zipLines$: Observable<any>;

        if (moreLine > 0) {
            zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
        } else {
            zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
        }

        zipLines$.subscribe(([line, tline]) => {
            this.makeLine(line, tline);
        });

        console.log(this.lines);
    }

    private makeLine(line: string, tline = '') { // 歌词转换
        console.log(line)
        const result = timeExp.exec(line);
        console.log(result)

        if (result) {
            const txt = line.replace(timeExp, '').trim();
            const txtCn = tline ? tline.replace(timeExp, '').trim() : '';

            if (txt) {
                const thirdResult = result[3] || '00';
                const len = thirdResult.length;
                const _thirdResult = len > 2 ? parseInt(thirdResult, 10) : parseInt(thirdResult, 10) * 10;
                const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
                this.lines.push({ txt, txtCn, time });
            }
        }
        console.log( this.lines)

    }

    play(startTime = 0, skip = false) {
        if (!this.lines.length) { return; }

        if (!this.playing) {
            this.playing = true;
        }
        this.curNum = this.findCurNum(startTime);
        this.startStamp = Date.now() - startTime;
        if (!skip) {

            this.callHandle(this.curNum - 1);
        }

        if (this.curNum < this.lines.length) {
            this.clearTimer();
            this.playReset();
        }
    }

    private playReset() {
        let line = this.lines[this.curNum];
        const delay = line.time - (Date.now() - this.startStamp);
        this.timer$ = timer(delay).subscribe(() => {
            this.callHandle(this.curNum++);
            if (this.curNum < this.lines.length && this.playing) {
                this.playReset();
            }
        });
    }

    private clearTimer() {
        this.timer$ && this.timer$.unsubscribe();

    }

    private callHandle(i: number) {
        if (i > 0) {
            this.handle.next({
                txt: this.lines[i].txt,
                txtCn: this.lines[i].txtCn,
                lineNum: i
            });
        }
    }

    private findCurNum(time: number): number {
        const index = this.lines.findIndex(item => time <= item.time);

        return index === -1 ? this.lines.length - 1 : index;
    }

    togglePlay(playing: boolean) {
        const now = Date.now();
        this.playing = playing;
        if (playing) {
            const startTime = (this.pauseStamp || now) - (this.startStamp || now);
            this.play(startTime, true);
        } else {
            this.stop();
            this.pauseStamp = now;
        }
    }

    stop() {
        if (this.playing) {
            this.playing = false;
        }
        this.clearTimer();
    }

    seek(time: number) {
        this.play(time);
    }

}
