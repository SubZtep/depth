declare type VideoStatePose = any;
declare type Logger = any;
export default class DbQueries {
    #private;
    constructor(client: any, logger?: Logger);
    getVideoId({ src, duration, width, height }: Db.Video): Promise<number | undefined>;
    insertPoses(videoId: number, poses: VideoStatePose[]): Promise<void>;
    insertPose(videoId: number, ts: number, results: any): Promise<void>;
}
export {};
