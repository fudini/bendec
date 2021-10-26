package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>Header</h2>
 * <p>struct description</p>
 * <p>Byte length: 1</p>
 * <p>u8 > int msgType - undefined | size 1</p>
 * */

public class Header {

    private int msgType;
    public static int byteLength = 1;

    public Header(int msgType) {
        this.msgType = msgType;
    }

    public Header() {
    }


    public int getMsgType() {
        return this.msgType;
    };

    @Override
    public int hashCode() {
        return Objects.hash(msgType);
    }

    @Override
    public String toString() {
        return "Header{" +
            "msgType=" + msgType +
            '}';
        }

}
