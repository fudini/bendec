package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>Person</h2>
 * <p>undefined</p>
 * <p>Byte length: 11</p>
 * <p>u16 > int a - undefined | size 2</p>
 * <p>u32 > long b - undefined | size 4</p>
 * <p>u32 > long c - undefined | size 4</p>
 * <p>u8 > int d - undefined | size 1</p>
 * */

public class Person {

    private int a;
    private long b;
    private long c;
    private int d;
    public static int byteLength = 11;

    public Person(int a, long b, long c, int d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    public Person() {
    }


    public int getA() {
        return this.a;
    };
    public long getB() {
        return this.b;
    };
    public long getC() {
        return this.c;
    };
    public int getD() {
        return this.d;
    };

    @Override
    public int hashCode() {
        return Objects.hash(a, b, c, d);
    }

    @Override
    public String toString() {
        return "Person{" +
            "a=" + a +
            ", b=" + b +
            ", c=" + c +
            ", d=" + d +
            '}';
        }

}
