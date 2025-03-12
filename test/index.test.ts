import { throws, equal } from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'

import { SnowflakeId } from '../src'

describe('SnowflakeId', () => {

    describe('validation',  () => {

      it('Invalid epoch', () => {
        throws(() => {
            new SnowflakeId(-1, 0)
        }, /^Error: Invalid epoch$/)      
      })

      it('Invalid nodeId', () => {
          throws(() => {
              new SnowflakeId(0, -1)
          }, /^Error: Invalid nodeId$/) 
          
          throws(() => {
            new SnowflakeId(0, 2 ** 10)
        }, /^Error: Invalid nodeId$/) 
          throws(() => {
            new SnowflakeId(0, 2 ** 10 + 1)
        }, /^Error: Invalid nodeId$/) 
      })
    })    

    describe('generate', () => {
      let now: number

      beforeEach(() => {
        now = Date.now();

        mock.timers.enable({ apis: ['Date'] });
        mock.timers.setTime(now);
      })

      afterEach(() => {
        mock.timers.reset()
      })

      it('epoch = 0', () => {
        const id = new SnowflakeId(0, 0)
        
        equal(id.generate(), BigInt(now) << 22n)
      })

      it('epoch = 2025-01-01', () => {
        const epoch = new Date('2025-01-01').getTime()
        const id = new SnowflakeId(epoch, 0)

        equal( id.generate(), BigInt(now - epoch) << 22n)
      })

      it('custom nodeId', () => {
        const nodeId = 123
        const id = new SnowflakeId(0, nodeId)

        equal(id.generate(), (BigInt(now) << 22n) | BigInt(nodeId << 12))
      })

      it('sequance generation', (ctx) => {
        const id = new SnowflakeId(0, 0)

        equal(id.generate(), (BigInt(now) << 22n) | 0n)
        equal(id.generate(), (BigInt(now) << 22n) | 1n)
        equal(id.generate(), (BigInt(now) << 22n) | 2n)
      })

      it('next timestamp', (ctx) => {
        const id = new SnowflakeId(0, 0)

        equal(id.generate(), (BigInt(now) << 22n) | 0n)
        mock.timers.tick(1)

        equal(id.generate(), (BigInt(now + 1) << 22n) | 0n)
      })

      it('overflow counter', (ctx) => {
        const id = new SnowflakeId(0, 0)

        for (let i = 0; i < 2 ** 12; ++i) {
          equal(id.generate(), (BigInt(now) << 22n) | BigInt(i))
        }

        equal(id.generate(), (BigInt(now + 1) << 22n) | 0n)
        equal(id.generate(), (BigInt(now + 1) << 22n) | 1n)
      })

    })

})