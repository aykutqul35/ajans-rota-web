import fs from 'fs';
import { SourceMapConsumer } from 'source-map';

const rawSourceMap = fs.readFileSync('dist/assets/index-B0OPwl_R.js.map', 'utf8');

SourceMapConsumer.with(rawSourceMap, null, consumer => {
  const pos = consumer.originalPositionFor({
    line: 93,
    column: 128416
  });
  console.log(pos);
});
