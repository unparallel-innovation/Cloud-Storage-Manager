export default abstract class CloudStorageManager {
    props: any;

    static  type: string;

    constructor(props: any) {

        this.props = props;
    }

    abstract uploadFile(origin: string, destination: string, conf:any):any;
    abstract getFile(path: string):any;
    abstract deleteFile(path: string):any;
    abstract deleteFolder(path: string):any;
    abstract moveFile(source: string, destination: string):any;
    abstract moveFolder(source: string, destination: string):any;
    abstract disconnect():any;
    abstract listFiles():any;
    abstract getFileURL(path:string):string;
}