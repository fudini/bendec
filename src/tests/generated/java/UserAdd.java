package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>UserAdd</h2>
 * <p>undefined</p>
 * <p>Byte length: 78</p>
 * <p>Header header - undefined | size 1</p>
 * <p>User user - undefined | size 77</p>
 * */

public class UserAdd {

    private Header header;
    private User user;
    public static int byteLength = 78;

    public UserAdd(Header header, User user) {
        this.header = header;
        this.user = user;
    }

    public UserAdd() {
    }


    public Header getHeader() {
        return this.header;
    };
    public User getUser() {
        return this.user;
    };

    @Override
    public int hashCode() {
        return Objects.hash(header, user);
    }

    @Override
    public String toString() {
        return "UserAdd{" +
            "header=" + header +
            ", user=" + user +
            '}';
        }

}
