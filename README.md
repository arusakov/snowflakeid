# snowflakeid

```javascript

const customEpoch = new Date('2025-01-01').getTime()
const nodeId = 1 // based on ip, process id, etc
const snowflake = new SnowflakeId(customEpoch, nodeId)

const id1 = snowflake.generate()
const id2 = snowflake.generate()
// etc
```