import CloudStorageManager from "../CloudStorageManager";
// @ts-ignore
import * as mime from "mime-types"
import * as AWS from  "aws-sdk"
import * as fs from 'fs';
// @ts-ignore
import * as Mustache from "mustache";
const fileUrlTemplate = "https://{{bucket}}.s3.{{region}}.amazonaws.com/{{{path}}}"

export default class S3CloudStorageManager extends CloudStorageManager{

    s3:any;
    constructor(props: any) {
        super(props);
        this.s3 = new AWS.S3({...this.props?.credentials,signatureVersion: 'v4'})
    }
    static type = "s3";


    deleteFile(path: string) {
        const objectParams = {
            Bucket: this.props.credentials.bucket,
            Key: path
        }

        return this.s3.deleteObject(objectParams).promise();
    }

    deleteFolder(path : string) {

    }

    disconnect() {
    }

    getFile(path: string) {
        const objectParams = {
            Bucket: this.props.credentials.bucket,
            Key: path
        }
        return this.s3.getObject(objectParams).promise()
    }

    getFileURL(path: string): string {
        return Mustache.render(fileUrlTemplate,{
            bucket: this.props.credentials.bucket,
            region: this.props.credentials.region,
            path: path.replace(/^\/|\/$/g, '')
        })
    }

    listFiles() {
    }

    moveFile(source: string, destination: string) {
    }

    moveFolder(source: string, destination: string) {
    }

    uploadFile(origin:string, destination:string, conf:any) {
        const contentType = mime.lookup(origin)
        const readStream = fs.createReadStream(origin);


        var objectParams = {
            ContentMD5: conf?.ContentMD5,
            ACL:conf?.publicRead?'public-read':undefined,
            ...conf?.headers,
            Bucket: this.props.credentials.bucket,
            Key: destination,
            Body: readStream,
            ContentType: contentType
        };

        return this.s3.putObject(objectParams).promise();
    }

}