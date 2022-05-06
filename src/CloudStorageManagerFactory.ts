import S3CloudStorageManager from './cloudServices/S3CloudStorageManager'

export default class CloudStorageManagerFactory{
    static create(type:string, props:any){
        if(S3CloudStorageManager.type === type){
            return new S3CloudStorageManager(props)
        }
        throw new Error("Cloud service " + type + " not found")
    }
}