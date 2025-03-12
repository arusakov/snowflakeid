export class SnowflakeId {

    protected readonly nodeId: bigint
    protected readonly epoch: number // because Date.now()

    protected timestamp = 0
    protected counter = 0n

    constructor(epoch: number, nodeId: number) {
        if (nodeId < 0 || nodeId >= 2 ** 10) {
            throw new Error('Invalid nodeId')
        }
        this.nodeId = BigInt(nodeId << 12)

        if (epoch < 0) {
            throw new Error('Invalid epoch')
        }
        this.epoch = epoch
    }

    generate() {
        const timestamp = Date.now() - this.epoch

        if (this.timestamp < timestamp) {
            this.timestamp = timestamp
            this.counter = 0n
        } else if (this.counter >= 4096) { // 2 ** 12
            this.timestamp = timestamp + 1
            this.counter = 0n
        }

        return (
            (BigInt(this.timestamp) << 22n) |
            this.nodeId | // already shifted
            (this.counter++) // postfix increment
        )
    }
}
