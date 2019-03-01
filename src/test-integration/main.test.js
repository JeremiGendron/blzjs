const {bluzelle, version} = require('../main');
const assert = require('assert');
const {pub_from_priv} = require('../ecdsa_secp256k1');


const log = false;
const entry = 'ws://localhost:50000';
const p2p_latency_bound = 100;

describe('integration', () => {

    it('version', () => {

        assert(typeof version === 'string');
        assert(version.length > 0);

    });


    it('create and read', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        await bz.create('hello', 'world');

        assert.equal(await bz.read('hello'), 'world');

        assert.equal(await bz.quickread('hello'), 'world');

        bz.close();

    });


    it('update', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        await bz.create('hello', 'world');

        await bz.update('hello', 'earth');

        assert.equal(await bz.read('hello'), 'earth');

        bz.close();

    });


    it('has', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        assert(!await bz.has('hello'));

        await bz.create('hello', 'world');

        assert(await bz.has('hello'));

        bz.close();

    });



    it('delete', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        await bz.create('hello', 'world');

        await bz.delete('hello');

        assert(!await bz.has('hello'));

        bz.close();

    });


    it('size', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        assert.equal(await bz.size(), 0);

        await bz.create('this', 'that');

        assert(await bz.size() > 0);

        bz.close();

    });


    it('keys', async () => {    

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        assert.deepEqual(await bz.keys(), []);

        await bz.create('a', 'b');

        assert.deepEqual(await bz.keys(), ['a']);
        
        bz.close();

    });


    it('hasDB/createDB/deleteDB', async () => {    

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });


        assert(!await bz.hasDB());

        await bz.createDB();

        assert(await bz.hasDB());

        await bz.deleteDB();

        assert(!await bz.hasDB());

        bz.close();

    });


    it('writers', async () => {


        const my_pem = 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==';

        const bz = bluzelle({
            entry, 
            private_pem: my_pem, 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });


        await bz.createDB();

        assert.deepEqual(
            await bz.getWriters(), 
            {
                owner: pub_from_priv(my_pem),
                writers: []
            }
        );


        const writers = [
            'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEndHOcS6bE1P9xjS/U+SM2a1GbQpPuH9sWNWtNYxZr0JcF+sCS2zsD+xlCcbrRXDZtfeDmgD9tHdWhcZKIy8ejQ==',
            'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE2cEPEoomeszFPuHzo2q45mfFkipLSCqc+pMlHCsGnZ5rJ4Bo27SZncCmwoazcYjoV9DjJjqi+p7IfSPRZCygaQ=='
        ];

        await bz.addWriters(writers);

        const writers_output = (await bz.getWriters()).writers;

        assert(writers_output.length === 2);
        assert(writers_output.includes(writers[0]));
        assert(writers_output.includes(writers[1]));


        // No duplicates 

        await bz.addWriters(writers);

        assert((await bz.getWriters()).writers.length === 2);


        await bz.deleteWriters(writers[0]);

        assert.deepEqual(
            await bz.getWriters(),
            {
                owner: pub_from_priv(my_pem),
                writers: [writers[1]]
            }
        );

        bz.close();

    });


    it('status', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        const status = await bz.status();

        assert(status.swarmGitCommit);
        assert(status.uptime);

        bz.close();

    });


    it('public key', () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log
        });


        assert.equal(bz.publicKey(), "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEY6L6fb2Xd9KZi05LQlZ83+0pIrjOIFvy0azEA+cDf7L7hMgRXrXj5+u6ys3ZSp2Wj58hTXsiiEPrRMMO1pwjRg==");

        bz.close();

    });

    it('type assertions', async () => {

        const bz = bluzelle({
            entry, 
            private_pem: 'MHQCAQEEIFH0TCvEu585ygDovjHE9SxW5KztFhbm4iCVOC67h0tEoAcGBSuBBAAKoUQDQgAE9Icrml+X41VC6HTX21HulbJo+pV1mtWn4+evJAi8ZeeLEJp4xg++JHoDm8rQbGWfVM84eqnb/RVuIXqoz6F9Bg==', 
            uuid: Math.random().toString(),
            log,
            p2p_latency_bound,
        });

        await bz.createDB();

        assert.throws(() => bz.create('hello', 3));
        assert.throws(() => bz.addWriters(3));
        assert.throws(() => bz.addWriters(['w1', 'w2', {}]));

        bz.close();

    });

});