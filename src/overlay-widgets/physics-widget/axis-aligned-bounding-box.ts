import { Vector2 } from "./tree-math";

export class AABB {
    center: Vector2;
    extents: Vector2;
    velocity: Vector2;
    acceleration: Vector2;

    constructor(center: Vector2, extents: Vector2, velocity: Vector2 = new Vector2(), acceleration: Vector2 = new Vector2()) {
        this.center = center;
        this.extents = extents;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }

    min(): Vector2 {
        return new Vector2(this.center.values[0] - this.extents.values[0], this.center.values[1] - this.extents.values[1]);
    }

    max(): Vector2 {
        return new Vector2(this.center.values[0] + this.extents.values[0], this.center.values[1] + this.extents.values[1]);
    }

    size(): Vector2 {
        return new Vector2(this.extents.values[0] * 2, this.extents.values[1] * 2);
    }

    minkowskiDifference(other: AABB): AABB {
        const topLeft = this.min().subtract(other.max());
        const fullSize = this.size().add(other.size());

        return new AABB(topLeft.add(fullSize.divideScalar(2)), fullSize.divideScalar(2));
    }

    isColliding(difference: AABB): boolean {
        let colliding = false;
        const min = difference.min();
        const max = difference.max();
        if (min.values[0] <= 0 && max.values[0] >= 0 && min.values[1] <= 0 && max.values[1] >= 0) {
            colliding = true;
            // console.log(`minx:${min.values[0]} minY:${max.values[0]} maxX:${min.values[1]} maxY:${max.values[1]}`);
        } else {
            // https://blog.hamaluik.ca/posts/swept-aabb-collision-using-minkowski-difference/
        }

        return colliding;
    }

    // taken from https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
    // returns the point where they intersect (if they intersect)
    // returns null if they don't intersect
    private getRayIntersectionFractionOfFirstRay(originA: Vector2, endA: Vector2, originB: Vector2, endB: Vector2): number | null {
        var r = endA.subtract(originA);
        var s = endB.subtract(originB);

        var numerator: number = originB.subtract(originA).crossProduct(r);
        var denominator: number = r.crossProduct(s);

        if (numerator == 0 && denominator == 0) {
            // the lines are co-linear
            // check if they overlap
			/*return	((originB.x - originA.x < 0) != (originB.x - endA.x < 0) != (endB.x - originA.x < 0) != (endB.x - endA.x < 0)) || 
					((originB.y - originA.y < 0) != (originB.y - endA.y < 0) != (endB.y - originA.y < 0) != (endB.y - endA.y < 0));*/
            return null;
        }
        if (denominator == 0) {
            // lines are parallel
            return null;
        }

        var u: number = numerator / denominator;
        var t: number = originB.subtract(originA).crossProduct(s) / denominator;
        if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
            //return originA + (r * t);
            return t;
        }
        return null;
    }

    public getRayIntersectionFraction(origin: Vector2, direction: Vector2): number | null {
        var end: Vector2 = origin.add(direction);

        const min = this.min();
        const max = this.max();

        var minT = this.getRayIntersectionFractionOfFirstRay(origin, end, new Vector2(min.values[0], min.values[1]), new Vector2(min.values[0], max.values[1]));
        let x = this.getRayIntersectionFractionOfFirstRay(origin, end, new Vector2(min.values[0], max.values[1]), new Vector2(max.values[0], max.values[1]));
        if (!!x && !!minT && x < minT)
            minT = x;
        x = this.getRayIntersectionFractionOfFirstRay(origin, end, new Vector2(max.values[0], max.values[1]), new Vector2(max.values[0], min.values[1]));
        if (!!x && !!minT && x < minT)
            minT = x;
        x = this.getRayIntersectionFractionOfFirstRay(origin, end, new Vector2(max.values[0], min.values[1]), new Vector2(min.values[0], min.values[1]));
        if (!!x && !!minT && x < minT)
            minT = x;

        // ok, now we should have found the fractional component along the ray where we collided
        return minT;
    }

    // intersectsWith(nextFrame: Vector2, otherStart: Vector2, otherEnd: Vector2) {
    //     const rCrossS = otherEnd.crossProduct(nextFrame);
    //     const qMinusPCrossR = this.subtract(otherStart).crossProduct(otherEnd);
    //     const qMinusPCrossS = this.subtract(otherStart).crossProduct(nextFrame);
    //     // u = (q − p) × r / (r × s)
    //     const u = qMinusPCrossR / rCrossS;
    //     // t = (q − p) × s / (r × s)
    //     const t = qMinusPCrossS / rCrossS;
    //     // collinear, no intersection
    //     if (rCrossS === 0 && qMinusPCrossR === 0) {
    //         console.log('collinear, no intersection possible');
    //     }
    //     // the intersection is on u and t points
    //     else if (rCrossS !== 0 && (u >= 0 || u <= 1) && (t >= 0 || t <= 1)) {
    //         console.log(`Intersects on point (${u},${t})`);
    //     }
    //     // two lines are parallel no intersection
    //     else if (rCrossS === 0 && qMinusPCrossR !== 0) {
    //         console.log('parallel, no intersection possible');
    //     }
    //     // no intersection
    //     else {
    //         console.log('not parallel but no intersection');
    //     }
    // }

}