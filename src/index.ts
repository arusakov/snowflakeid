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

        if (timestamp !== this.timestamp) {
            this.timestamp = timestamp
            this.counter = 0n
        }

        return (
            BigInt(timestamp << 22) |
            this.nodeId | // already shifted
            (this.counter++) // postfix increment
        )
    }
}
