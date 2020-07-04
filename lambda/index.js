const AWS = require('aws-sdk');
const Sharp = require('sharp');

const S3 = new AWS.S3({region: 'ap-northeast-2'});  //  스토리지 S3 서비스

exports.handler = async (event, context, callback) => {
    const Bucket = event.Records[0].s3.bucket.name;  //Bucket 명
    const Key = event.Records[0].s3.object.key;   //파일 풀 경로
    const filename = Key.split('/')[Key.split('/').length-1];
    const ext = Key.split('.')[Key.split('.').length-1];

    console.log(Bucket, Key, filename, ext);

    const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;

    try{
        const s3Object = await S3.getObject({
            Bucket, 
            Key,
        }).promise();
        console.log('original', s3Object.Body.length); //s3Object : 원본이미지, Body: 실제데이터, length: 사이즈


        const resizedImage = await Sharp(s3Object.Body).resize(800, 800, {fit: 'inside'}).toFormat(requiredFormat).toBuffer();


        await S3.putObject({
            Bucket,
            Key: `thumb/${filename}`,
            Body: resizedImage
        }).promise();
        console.log('put');

        return callback(null, `thumb/${filename}`);
    }catch(error){
        console.error(error);
        return callback(error);
    }
};