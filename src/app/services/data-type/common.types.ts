export interface Banner {
    url: string;
    targetId: string;
    imageUrl: string;
}

export interface HotTag {
    id: number;
    name: string;
    position: number;
}

export interface SongSheet {
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    tracks: Array<Song>;
}

export interface Singer {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
}

export interface Song {
    id: number;
    name: string;
    url: string;
    ar: Array<Singer>;
    al: { id: number; name: string; picUrl: string };
    dt: number;
}

export interface SongUrl {
    id: number;
    url: string;
}

export interface Lyric {
    lyric: string;
    tlyric: string;
}

