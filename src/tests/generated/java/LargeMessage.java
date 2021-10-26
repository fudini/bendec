package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>LargeMessage</h2>
 * <p>undefined</p>
 * <p>Byte length: 301</p>
 * <p>Header header - undefined | size 1</p>
 * <p>Person person1 - undefined | size 11</p>
 * <p>Person person2 - undefined | size 11</p>
 * <p>u32 > long aaa - undefined | size 4</p>
 * <p>Price > long (u32) bbb - undefined | size 4</p>
 * <p>u32 > long ccc - undefined | size 4</p>
 * <p>u32 > long ddd - undefined | size 4</p>
 * <p>u32 > long eee - undefined | size 4</p>
 * <p>u8 > int fff - undefined | size 1</p>
 * <p>u8 > int ggg - undefined | size 1</p>
 * <p>char > String (char[]) name1 - undefined | size 64</p>
 * <p>char > String (char[]) name2 - undefined | size 64</p>
 * <p>char > String (char[]) name3 - undefined | size 64</p>
 * <p>char > String (char[]) name4 - undefined | size 64</p>
 * */

public class LargeMessage {

    private Header header;
    private Person person1;
    private Person person2;
    private long aaa;
    private long bbb;
    private long ccc;
    private long ddd;
    private long eee;
    private int fff;
    private int ggg;
    private String name1;
    private String name2;
    private String name3;
    private String name4;
    public static int byteLength = 301;

    public LargeMessage(Header header, Person person1, Person person2, long aaa, long bbb, long ccc, long ddd, long eee, int fff, int ggg, String name1, String name2, String name3, String name4) {
        this.header = header;
        this.person1 = person1;
        this.person2 = person2;
        this.aaa = aaa;
        this.bbb = bbb;
        this.ccc = ccc;
        this.ddd = ddd;
        this.eee = eee;
        this.fff = fff;
        this.ggg = ggg;
        this.name1 = name1;
        this.name2 = name2;
        this.name3 = name3;
        this.name4 = name4;
    }

    public LargeMessage() {
    }


    public Header getHeader() {
        return this.header;
    };
    public Person getPerson1() {
        return this.person1;
    };
    public Person getPerson2() {
        return this.person2;
    };
    public long getAaa() {
        return this.aaa;
    };
    public long getBbb() {
        return this.bbb;
    };
    public long getCcc() {
        return this.ccc;
    };
    public long getDdd() {
        return this.ddd;
    };
    public long getEee() {
        return this.eee;
    };
    public int getFff() {
        return this.fff;
    };
    public int getGgg() {
        return this.ggg;
    };
    public String getName1() {
        return this.name1;
    };
    public String getName2() {
        return this.name2;
    };
    public String getName3() {
        return this.name3;
    };
    public String getName4() {
        return this.name4;
    };

    @Override
    public int hashCode() {
        return Objects.hash(header, person1, person2, aaa, bbb, ccc, ddd, eee, fff, ggg, name1, name2, name3, name4);
    }

    @Override
    public String toString() {
        return "LargeMessage{" +
            "header=" + header +
            ", person1=" + person1 +
            ", person2=" + person2 +
            ", aaa=" + aaa +
            ", bbb=" + bbb +
            ", ccc=" + ccc +
            ", ddd=" + ddd +
            ", eee=" + eee +
            ", fff=" + fff +
            ", ggg=" + ggg +
            ", name1=" + name1 +
            ", name2=" + name2 +
            ", name3=" + name3 +
            ", name4=" + name4 +
            '}';
        }

}
