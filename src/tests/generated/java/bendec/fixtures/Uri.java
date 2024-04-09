package bendec.fixtures;

import java.math.BigInteger;
import java.util.*;
import java.nio.ByteBuffer;
import bendec.fixtures.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * <h2>Uri</h2>
 
 * <p>Byte length: 44</p>
 * <p>char > String (u8[]) protocol | size 10</p>
 * <p>char > String (u8[]) host | size 32</p>
 * <p>u16 > int port | size 2</p>
 */
public class Uri implements ByteSerializable, JsonSerializable {
    private String protocol;
    private String host;
    private int port;
    public static final int byteLength = 44;
    
    public Uri(String protocol, String host, int port) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
    }
    
    public Uri(byte[] bytes, int offset) {
        this.protocol = BendecUtils.stringFromByteArray(bytes, offset, 10);
        this.host = BendecUtils.stringFromByteArray(bytes, offset + 10, 32);
        this.port = BendecUtils.uInt16FromByteArray(bytes, offset + 42);
    }
    
    public Uri(byte[] bytes) {
        this(bytes, 0);
    }
    
    public Uri() {
    }
    
    public String getProtocol() {
        return this.protocol;
    }
    
    public String getHost() {
        return this.host;
    }
    
    public int getPort() {
        return this.port;
    }
    
    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }
    
    public void setHost(String host) {
        this.host = host;
    }
    
    public void setPort(int port) {
        this.port = port;
    }
    
    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.stringToByteArray(this.protocol, 10));
        buffer.put(BendecUtils.stringToByteArray(this.host, 32));
        buffer.put(BendecUtils.uInt16ToByteArray(this.port));
        return buffer.array();
    }
    
    @Override  
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.stringToByteArray(this.protocol, 10));
        buffer.put(BendecUtils.stringToByteArray(this.host, 32));
        buffer.put(BendecUtils.uInt16ToByteArray(this.port));
    }
    
    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.put("protocol", protocol);
        object.put("host", host);
        object.put("port", port);
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.put("protocol", protocol);
        object.put("host", host);
        object.put("port", port);
        return object;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(protocol,
        host,
        port);
    }
    
    @Override
    public String toString() {
        return "Uri {" +
            "protocol=" + protocol +
            ", host=" + host +
            ", port=" + port +
            "}";
    }
}