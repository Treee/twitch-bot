import "jasmine"
import { Vector2 } from './tree-math';

describe('Tree Math Spec', () => {

    let testVec2: Vector2;

    beforeEach(() => {

    });

    it('has an array of values representing x and y', () => {
        const expectedX = 42;
        const expectedY = 58;
        testVec2 = new Vector2(expectedX, expectedY);
        expect(testVec2.values).toEqual([expectedX, expectedY]);
    });

    it('adds two vectors together', () => {
        const expectedAX = 42;
        const expectedAY = 58;
        const expectedBX = 3;
        const expectedBY = 9;
        let aVec = new Vector2(expectedAX, expectedAY);
        let bVec = new Vector2(expectedBX, expectedBY);

        const actualResult = aVec.add(bVec);

        const expectedResult = new Vector2(expectedAX + expectedBX, expectedAY + expectedBY);

        expect(actualResult.values).toEqual(expectedResult.values);
    });

    it('subtracts one vector from another', () => {
        const expectedAX = 42;
        const expectedAY = 58;
        const expectedBX = 3;
        const expectedBY = 9;
        let aVec = new Vector2(expectedAX, expectedAY);
        let bVec = new Vector2(expectedBX, expectedBY);

        const actualResult = aVec.subtract(bVec);

        const expectedResult = new Vector2(expectedAX - expectedBX, expectedAY - expectedBY);

        expect(actualResult.values).toEqual(expectedResult.values);
    });

    it('subtracts one vector from another, proving not commutative', () => {
        const expectedAX = 42;
        const expectedAY = 58;
        const expectedBX = 3;
        const expectedBY = 9;
        let aVec = new Vector2(expectedAX, expectedAY);
        let bVec = new Vector2(expectedBX, expectedBY);

        const actualResult = bVec.subtract(aVec);

        const expectedResult = new Vector2(expectedBX - expectedAX, expectedBY - expectedAY);

        expect(actualResult.values).toEqual(expectedResult.values);
    });

    it('returns the magnitude of a vector', () => {
        testVec2 = new Vector2(3, 4);
        const expectedMagnitude = Math.sqrt((testVec2.values[0] * testVec2.values[0]) + (testVec2.values[1] * testVec2.values[1]));
        const actualMagnitude = testVec2.magnitude();
        expect(actualMagnitude).toEqual(expectedMagnitude);
    });

    it('normalizes a unit vector', () => {
        testVec2 = new Vector2(1, 1);
        const expectedNormalize = new Vector2(0.7071067811865475, 0.7071067811865475);
        const actualNormalized = testVec2.normalize();
        expect(actualNormalized).toEqual(expectedNormalize);
    });

    it('normalizes a negative unit vector', () => {
        testVec2 = new Vector2(-1, 1);
        const expectedNormalize = new Vector2(-0.7071067811865475, 0.7071067811865475);
        const actualNormalized = testVec2.normalize();
        expect(actualNormalized).toEqual(expectedNormalize);
    });

    it('normalizes a non unit vector', () => {
        testVec2 = new Vector2(1523, 600);
        const mag = testVec2.magnitude();
        const expectedNormalize = new Vector2(testVec2.values[0] / mag, testVec2.values[1] / mag);
        const actualNormalized = testVec2.normalize();
        expect(actualNormalized).toEqual(expectedNormalize);
    });

    it('normalizes a negative non unit vector', () => {
        testVec2 = new Vector2(-1523, -600);
        const mag = testVec2.magnitude();
        const expectedNormalize = new Vector2(testVec2.values[0] / mag, testVec2.values[1] / mag);
        const actualNormalized = testVec2.normalize();
        expect(actualNormalized).toEqual(expectedNormalize);
    });

    it('wont attempt to normalized a vector with a magnitude of 0 or less', () => {
        testVec2 = new Vector2(0, 0);
        expect(() => { testVec2.normalize() }).toThrow(new Error('Cannot normalize a vector with 0 magnitude.'));
    });

    it('dot products two non unit vectors', () => {
        const aVec = new Vector2(2, 4);
        const bVec = new Vector2(1, 3);
        const expectedDot = ((aVec.values[0] * bVec.values[0]) + (aVec.values[1] * bVec.values[1]));
        const actualDot = aVec.dot(bVec);

        expect(actualDot).toEqual(expectedDot);
    });

    it('dot products two unit vectors', () => {
        const aVec = new Vector2(1, 1);
        const bVec = new Vector2(-1, 1);
        const expectedDot = ((aVec.values[0] * bVec.values[0]) + (aVec.values[1] * bVec.values[1]));
        const actualDot = aVec.dot(bVec);

        expect(actualDot).toEqual(expectedDot);
    });
});