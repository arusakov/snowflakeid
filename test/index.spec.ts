import { throws, equal } from 'node:assert/strict'
import { describe, it } from 'node:test'

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

      it('epoch = 0', () => {
        const id = new SnowflakeId(0, 0)
        const now = Date.now()
        
        equal(id.generate(), BigInt(now << 22))
      })

      it('epoch = 2025-01-01', () => {
        const epoch = new Date('2025-01-01').getTime()
        const id = new SnowflakeId(epoch, 0)
        const now = Date.now()

        equal( id.generate(), BigInt((now - epoch) << 22))
      })

      it('custom nodeId', () => {
        const nodeId = 123
        const id = new SnowflakeId(0, nodeId)
        const now = Date.now()

        equal(id.generate(), BigInt((now << 22) | (nodeId << 12)))
      })

      it('sequance generation', () => {
        const id = new SnowflakeId(0, 0)
        const now = Date.now()

        equal(id.generate(), BigInt((now << 22) | 0))
        equal(id.generate(), BigInt((now << 22) | 1))
        equal(id.generate(), BigInt((now << 22) | 2))
      })

    })

})