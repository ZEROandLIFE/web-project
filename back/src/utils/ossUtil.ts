// utils/ossUtil.ts
import OSS from 'ali-oss';
import { Readable } from 'stream';

interface OssConfig {
  endpoint: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucketName: string;
}

class OssUtil {
  private client: OSS;
  private config: OssConfig;

  constructor(config: OssConfig) {
    this.config = config;
    this.client = new OSS({
      endpoint: config.endpoint,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucketName,
    });
  }


  public async upload(fileName: string, buffer: Buffer | Readable): Promise<string> {
    try {
      const result = await this.client.put(fileName, buffer);
      
      // 返回公开可访问的URL（不需要签名）
      return result.url.split('?')[0];
    } catch (error:any) {
      throw new Error(`文件上传失败: ${error.message}`);
    }
  }
}

// 从环境变量或配置文件中读取配置
const ossConfig: OssConfig = {
  endpoint: process.env.OSS_ENDPOINT || 'oss-cn-shanghai.aliyuncs.com',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || 'LTAI5t8QCh7pX7fe834kRqkX',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || 'V93UZ5e9AANLXeKkVV50NUMGGD6qTv',
  bucketName: process.env.OSS_BUCKET_NAME || 'web-2025project'
};

export const ossUtil = new OssUtil(ossConfig);