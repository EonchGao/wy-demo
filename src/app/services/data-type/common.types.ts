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
    coverImgUrl: string;
    playCount: number;
    tags: string[];
    createTime: number;
    creator: { nicname: string; avatarUrl: string; };
    description: string;
    subscribedCount: number;
    shareCount: number;
    commentCount: number;
    subscribed: boolean;
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

// 歌单列表 
export interface SheetList {
    playlists: SongSheet[];
    total: number;
}