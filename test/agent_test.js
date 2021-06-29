const {Agent, InteractiveAgent} = require('../agent');
const assert = require('assert');

describe('Simple Abstract Agent Tests', () => {
    it('Constructor Test', () => {
        const agent = new Agent('bob');
    });

    it('Go Throws Test', () => {
        const agent = new Agent('bob');

        assert.throws(agent.go, 
        {
            name: 'Error',
            message: 'Implement this method in a subclass'
        });
    });
});

describe('Simple Interactive Agent Tests', () => {
    it('Constructor Test', () => {
        const agent = new InteractiveAgent('bob');
    });
});