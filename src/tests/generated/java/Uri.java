package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>Uri</h2>
 * <p>undefined</p>
 * <p>Byte length: 44</p>
 * <p>char > String (char[]) protocol - undefined | size 10</p>
 * <p>char > String (char[]) host - undefined | size 32</p>
 * <p>u16 > int port - undefined | size 2</p>
 * */

public class Uri {

    private String protocol;
    private String host;
    private int port;
    public static int byteLength = 44;

    public Uri(String protocol, String host, int port) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
    }

    public Uri() {
    }


    public String getProtocol() {
        return this.protocol;
    };
    public String getHost() {
        return this.host;
    };
    public int getPort() {
        return this.port;
    };

    @Override
    public int hashCode() {
        return Objects.hash(protocol, host, port);
    }

    @Override
    public String toString() {
        return "Uri{" +
            "protocol=" + protocol +
            ", host=" + host +
            ", port=" + port +
            '}';
        }

}
