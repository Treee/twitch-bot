export class Vector2 {
    values: number[];
    constructor(x: number = 0, y: number = 0) {
        this.values = [x, y];
    }

    add(other: Vector2): Vector2 {
        return new Vector2((this.values[0] + other.values[0]), (this.values[1] + other.values[1]));
    }

    subtract(other: Vector2): Vector2 {
        return new Vector2((this.values[0] - other.values[0]), (this.values[1] - other.values[1]));
    }

    magnitude(): number {
        return Math.sqrt((this.values[0] * this.values[0]) + (this.values[1] * this.values[1]));
    }

    normalize(): Vector2 {
        const magnitude = this.magnitude();
        if (magnitude > 0) {
            return new Vector2(this.values[0] / magnitude, this.values[1] / magnitude);
        } else {
            throw new Error('Cannot normalize a vector with 0 magnitude.');
        }
    }

    dot(other: Vector2): number {
        return ((this.values[0] * other.values[0]) + (this.values[1] * other.values[1]));
    }
}