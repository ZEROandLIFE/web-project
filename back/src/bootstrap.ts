import { Bootstrap } from '@midwayjs/bootstrap';
import * as staticFile from '@midwayjs/static-file';

Bootstrap
  .configure({
    imports: [staticFile],
    moduleDetector: false
  })
  .run();