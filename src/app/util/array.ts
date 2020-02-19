import { getRandomInit } from './number';
import { Song } from '../services/data-type/common.types';

export function inArray(arr: any[], target: any): boolean {
    return arr.indexOf(target) !== -1;
}


export function shuffle<T>(arr: T[]): T[] {

    const result = arr.slice();

    for (let i = 0; i < result.length; i++) {
        // 0和i之间的一个随机数
        const j = getRandomInit([0, i]);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function findIndex(list: Song[], current: Song): number {
    return list.findIndex(item => item.id === current.id);
}
