import "jasmine"
import { Vector2 } from './tree-math';
import { AABB } from "./axis-aligned-bounding-box";

describe('AABB Spec', () => {

    let testAABB: AABB;

    beforeEach(() => {

    });

    it('returns true if the minkowski difference finds a collision', () => {
        const testWidth = new Vector2(10, 10);
        testAABB = new AABB(new Vector2(3, 3), testWidth);

        const otherAABB = new AABB(new Vector2(5, 5), testWidth);

        const difference = otherAABB.minkowskiDifference(testAABB);
        const actualResult = testAABB.isColliding(difference);
        expect(actualResult).toBe(true);
    });

    it('returns false if the minkowski difference does not find a collision', () => {
        const testWidth = new Vector2(10, 10);
        testAABB = new AABB(new Vector2(0, 0), testWidth);

        const otherAABB = new AABB(new Vector2(25, 25), testWidth);

        const difference = otherAABB.minkowskiDifference(testAABB);
        const actualResult = testAABB.isColliding(difference);
        expect(actualResult).toBe(false);
    });

});