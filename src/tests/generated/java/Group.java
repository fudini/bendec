package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>Group</h2>
 * <p>undefined</p>
 * <p>Byte length: 394</p>
 * <p>Header header - undefined | size 1</p>
 * <p>u8 > int [] (u8[]) ints - undefined | size 8</p>
 * <p>User > User [] (User[]) users - undefined | size 385</p>
 * */

public class Group {

    private Header header;
    private int [] ints;
    private User [] users;
    public static int byteLength = 394;

    public Group(Header header, int [] ints, User [] users) {
        this.header = header;
        this.ints = ints;
        this.users = users;
    }

    public Group() {
    }


    public Header getHeader() {
        return this.header;
    };
    public int [] getInts() {
        return this.ints;
    };
    public User [] getUsers() {
        return this.users;
    };

    @Override
    public int hashCode() {
        return Objects.hash(header, ints, users);
    }

    @Override
    public String toString() {
        return "Group{" +
            "header=" + header +
            ", ints=" + ints +
            ", users=" + users +
            '}';
        }

}
