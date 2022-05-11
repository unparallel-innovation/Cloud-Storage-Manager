import CloudStorageManager from "../CloudStorageManager";
// @ts-ignore
import * as mime from "mime-types"
import * as AWS from  "aws-sdk"
import * as fs from 'fs';
// @ts-ignore
import * as Mustache from "mustache";
const amazonS3FileTemplate = "https://{{bucket}}.s3.amazonaws.com/{{{path}}}"


interface credentials {
    accessKeyId: string,
    secretAccessKey: string,
    bucket: string
}

export default class S3CloudStorageManager extends CloudStorageManager{

    s3:any;
    credentials: credentials
    fileUrlTemplate: string
    constructor(props: any) {
        super(props);
        this.credentials = {
            accessKeyId: this.props?.credentials?.accessKeyId || this.props?.accessKeyId,
            secretAccessKey: this.props?.credentials?.secretAccessKey || this.props?.secretAccessKey,
            bucket: this.props?.credentials?.bucket || this.props?.bucket
        }
        this.fileUrlTemplate = this.props.fileUrlTemplate || amazonS3FileTemplate;
        this.s3 = new AWS.S3({...this.credentials,signatureVersion: 'v4'})
    }
    static type = "s3";


    deleteFile(path: string) {
        const objectParams = {
            Bucket: this.credentials.bucket,
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
            Bucket: this.credentials.bucket,
            Key: path
        }
        return this.s3.getObject(objectParams).promise()
    }

    getFileURL(path: string): string {
        return Mustache.render(this.fileUrlTemplate,{
            bucket: this.credentials.bucket,
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
        const readStream = fs.createReadStream(origin);
        return this.uploadFileBody(readStream, destination, conf)
    }

    uploadFileBody(body: any, destination: string, conf: any) {
        const contentType = mime.lookup(destination)
        const objectParams = {
            ContentMD5: conf?.ContentMD5,
            ACL:conf?.publicRead?'public-read':undefined,
            ...conf?.headers,
            Bucket: this.credentials.bucket,
            Key: destination,
            Body: body,
            ContentType: contentType
        };
        return this.s3.putObject(objectParams).promise();
    }


}