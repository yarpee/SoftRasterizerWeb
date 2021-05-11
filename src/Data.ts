export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    public static right: Vector3 = new Vector3(1, 0, 0);
    public static up: Vector3 = new Vector3(0, 1, 0);
    public static front: Vector3 = new Vector3(0, 0, 1);

    public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static add(a: Vector3, b: Vector3): Vector3 {
        var c = new Vector3();
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.z = a.z + b.z;
        return c;
    }

    public static subtract(a: Vector3, b: Vector3): Vector3 {
        var c = new Vector3();
        c.x = a.x - b.x;
        c.y = a.y - b.y;
        c.z = a.z - b.z;
        return c;
    }

    public static cross(a: Vector3, b: Vector3): Vector3 {
        var c = new Vector3();
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    }

    public static dot(a: Vector3, b: Vector3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    public static scale(a: Vector3, b: number): Vector3 {
        var c = new Vector3();
        c.x = a.x * b;
        c.y = a.y * b;
        c.z = a.z * b;
        return c;
    }

    public static normalize(a: Vector3): Vector3 {
        var c = new Vector3(a.x, a.y, a.z);
        var len = a.x * a.x + a.y * a.y + a.z * a.z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            c.x *= len;
            c.y *= len;
            c.z *= len;
        }
        return c;
    }

    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public floorXY(): void {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    public multiplyMatrix4x4(m: Matrix4x4): Vector3 {
        var c = new Vector3();
        c.x = this.x * m.get(0, 0) + this.y * m.get(0, 1) + this.z * m.get(0, 2) + m.get(0, 3);
        c.y = this.x * m.get(1, 0) + this.y * m.get(1, 1) + this.z * m.get(1, 2) + m.get(1, 3);
        c.z = this.x * m.get(2, 0) + this.y * m.get(2, 1) + this.z * m.get(2, 2) + m.get(2, 3);
        var w = this.x * m.get(3, 0) + this.y * m.get(3, 1) + this.z * m.get(3, 2) + m.get(3, 3);
        if (w != 1) {
            // console.error("w != 1");
            c.x /= w;
            c.y /= w;
            c.z /= w;
        }
        return c;
    }
}

export class Matrix4x4 {
    public elements: Float32Array;

    public constructor() {
        this.elements = new Float32Array(16);
    }

    public identity(): void {
        var e: Float32Array = this.elements;
        e[1] = e[2] = e[3] = e[4] = e[6] = e[7] = e[8] = e[9] = e[11] = e[12] = e[13] = e[14] = 0;
        e[0] = e[5] = e[10] = e[15] = 1;
    }

    public set(row: number, column: number, data: number): void {
        var index = row * 4 + column;
        this.elements[index] = data;
    }

    public get(row: number, column: number): number {
        var index = row * 4 + column;
        return this.elements[index];
    }

    public transpose(): void {
        var e: Float32Array, t: number;
        e = this.elements;
        t = e[1];
        e[1] = e[4];
        e[4] = t;
        t = e[2];
        e[2] = e[8];
        e[8] = t;
        t = e[3];
        e[3] = e[12];
        e[12] = t;
        t = e[6];
        e[6] = e[9];
        e[9] = t;
        t = e[7];
        e[7] = e[13];
        e[13] = t;
        t = e[11];
        e[11] = e[14];
        e[14] = t;
    }

    public static multiply(left: Matrix4x4, right: Matrix4x4): Matrix4x4 {
        var out = new Matrix4x4();

        var l: Float32Array = right.elements;
        var r: Float32Array = left.elements;
        var e: Float32Array = out.elements;

        var l11: number = l[0], l12: number = l[1], l13: number = l[2], l14: number = l[3];
        var l21: number = l[4], l22: number = l[5], l23: number = l[6], l24: number = l[7];
        var l31: number = l[8], l32: number = l[9], l33: number = l[10], l34: number = l[11];
        var l41: number = l[12], l42: number = l[13], l43: number = l[14], l44: number = l[15];

        var r11: number = r[0], r12: number = r[1], r13: number = r[2], r14: number = r[3];
        var r21: number = r[4], r22: number = r[5], r23: number = r[6], r24: number = r[7];
        var r31: number = r[8], r32: number = r[9], r33: number = r[10], r34: number = r[11];
        var r41: number = r[12], r42: number = r[13], r43: number = r[14], r44: number = r[15];

        e[0] = (l11 * r11) + (l12 * r21) + (l13 * r31) + (l14 * r41);
        e[1] = (l11 * r12) + (l12 * r22) + (l13 * r32) + (l14 * r42);
        e[2] = (l11 * r13) + (l12 * r23) + (l13 * r33) + (l14 * r43);
        e[3] = (l11 * r14) + (l12 * r24) + (l13 * r34) + (l14 * r44);
        e[4] = (l21 * r11) + (l22 * r21) + (l23 * r31) + (l24 * r41);
        e[5] = (l21 * r12) + (l22 * r22) + (l23 * r32) + (l24 * r42);
        e[6] = (l21 * r13) + (l22 * r23) + (l23 * r33) + (l24 * r43);
        e[7] = (l21 * r14) + (l22 * r24) + (l23 * r34) + (l24 * r44);
        e[8] = (l31 * r11) + (l32 * r21) + (l33 * r31) + (l34 * r41);
        e[9] = (l31 * r12) + (l32 * r22) + (l33 * r32) + (l34 * r42);
        e[10] = (l31 * r13) + (l32 * r23) + (l33 * r33) + (l34 * r43);
        e[11] = (l31 * r14) + (l32 * r24) + (l33 * r34) + (l34 * r44);
        e[12] = (l41 * r11) + (l42 * r21) + (l43 * r31) + (l44 * r41);
        e[13] = (l41 * r12) + (l42 * r22) + (l43 * r32) + (l44 * r42);
        e[14] = (l41 * r13) + (l42 * r23) + (l43 * r33) + (l44 * r43);
        e[15] = (l41 * r14) + (l42 * r24) + (l43 * r34) + (l44 * r44);

        return out;
    }
}

export class Face {
    public vertexIndexs: number[] = [];
    public textureIndexs: number[] = [];
    public normalIndexs: number[] = [];

    public constructor() {
    }
}