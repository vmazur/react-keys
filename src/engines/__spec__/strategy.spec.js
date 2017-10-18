import sinon from 'sinon';
import { STRATEGY_MIRROR, STRATEGY_START } from '../../constants';
import {
  findMirrorExitId,
  findStartExitId,
  findIdByStrategy,
} from '../strategy';
import * as helpers from '../helpers';

describe('strategy', () => {
  describe('findIdByStrategy', () => {
    it(
      'should return first elements id when no strategy',
      sinon.test(function() {
        const state = {
          binders: [
            {
              id: 'myId',
              selectedId: 'xoxo',
              strategy: 'none',
              elements: [{ id: 'xixi' }],
            },
          ],
        };
        findIdByStrategy(state, 'myId', null).should.equal('xixi');
      })
    );

    it(
      'should return selectedId when memory is true',
      sinon.test(function() {
        const id = 'xoxo';
        const state = {
          binders: [
            {
              id: 'myId',
              selectedId: id,
              memory: true,
              elements: [{ id: 'xixi' }],
            },
          ],
        };
        findIdByStrategy(state, 'myId', null).should.equal(id);
      })
    );

    it(
      'should return mirrorId on strategy mirror',
      sinon.test(function() {
        const canvas = document.createElement('canvas');
        const firstElement = document.createElement('li');
        firstElement.setAttribute('id', 'elOne');
        this.stub(firstElement, 'getBoundingClientRect').returns({ left: 10 });
        const secondElement = document.createElement('li');
        secondElement.setAttribute('id', 'elTwo');
        this.stub(secondElement, 'getBoundingClientRect').returns({ left: 0 });
        canvas.appendChild(firstElement);
        canvas.appendChild(secondElement);

        this.stub(document, 'getElementById').returns(canvas);

        const state = {
          current: { selectedId: 1 },
          binders: [
            {
              id: 'myId',
              selectedId: 'xoxo',
              strategy: STRATEGY_MIRROR,
              selector: 'li',
            },
          ],
        };
        findIdByStrategy(state, 'myId', null).should.equal('elTwo');
      })
    );

    it(
      'should return startId on start id',
      sinon.test(function() {
        const canvas = document.createElement('canvas');
        const firstElement = document.createElement('li');
        firstElement.setAttribute('id', 'elOne');
        this.stub(firstElement, 'getBoundingClientRect').returns({ left: 10 });
        const secondElement = document.createElement('li');
        secondElement.setAttribute('id', 'elTwo');
        this.stub(secondElement, 'getBoundingClientRect').returns({ left: 0 });
        canvas.appendChild(firstElement);
        canvas.appendChild(secondElement);

        this.stub(document, 'getElementById').returns(canvas);
        const state = {
          binders: [
            {
              id: 'myId',
              selectedId: 'xoxo',
              strategy: STRATEGY_START,
              selector: 'li',
            },
          ],
        };
        findIdByStrategy(state, 'myId', null).should.equal('elTwo');
      })
    );
  });

  describe('findMirrorExitId', () => {
    it(
      'should find mirrored id',
      sinon.test(function() {
        const state = { current: { selectedId: 1 } };
        const leftElement = { getBoundingClientRect: () => ({ left: 20 }) };
        this.stub(helpers, 'getDomElement').returns(leftElement);
        const children = [
          { id: '1', getBoundingClientRect: () => ({ left: 0 }) },
          { id: '2', getBoundingClientRect: () => ({ left: 10 }) },
          { id: '3', getBoundingClientRect: () => ({ left: 20 }) },
          { id: '4', getBoundingClientRect: () => ({ left: 30 }) },
        ];
        this.stub(helpers, 'getCurrentChildren').returns(children);
        findMirrorExitId('binderId', 'selector', 'left', state).should.equal(
          '3'
        );
      })
    );
  });

  describe('findStartExitId', () => {
    it(
      'should find first started id',
      sinon.test(function() {
        const dom = { getBoundingClientRect: () => ({ left: 15 }) };
        this.stub(helpers, 'getDomElement').returns(dom);
        const children = [
          { id: '1', getBoundingClientRect: () => ({ left: 0 }) },
          { id: '2', getBoundingClientRect: () => ({ left: 10 }) },
          { id: '3', getBoundingClientRect: () => ({ left: 20 }) },
          { id: '4', getBoundingClientRect: () => ({ left: 30 }) },
        ];
        this.stub(helpers, 'getCurrentChildren').returns(children);
        findStartExitId('selector', 'left', 'binderId').should.equal('3');
      })
    );

    it(
      'should get first item when its left : 0',
      sinon.test(function() {
        const dom = { getBoundingClientRect: () => ({ left: 0 }) };
        this.stub(helpers, 'getDomElement').returns(dom);
        const children = [
          { id: '1', getBoundingClientRect: () => ({ left: 0 }) },
          { id: '2', getBoundingClientRect: () => ({ left: 10 }) },
          { id: '3', getBoundingClientRect: () => ({ left: 20 }) },
          { id: '4', getBoundingClientRect: () => ({ left: 30 }) },
        ];
        this.stub(helpers, 'getCurrentChildren').returns(children);
        findStartExitId('selector', 'left', 'binderId').should.equal('1');
      })
    );
  });
});
