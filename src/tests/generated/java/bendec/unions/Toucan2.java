package bendec.unions;

import java.math.BigInteger;
import java.util.*;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * <h2>Toucan2</h2>
 
 * <p>Byte length: 3</p>
 * <p>Header header | size 1</p>
 * <p>u16 > int wingspan | size 2</p>
 */
public class Toucan2 implements ByteSerializable, JsonSerializable, Animal2 {
    private Header header;
    private int wingspan;
    public static final int byteLength = 3;
    
    public Toucan2(Header header, int wingspan) {
        this.header = header;
        this.wingspan = wingspan;
    }
    
    public Toucan2(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.wingspan = BendecUtils.uInt16FromByteArray(bytes, offset + 1);
    }
    
    public Toucan2(byte[] bytes) {
        this(bytes, 0);
    }
    
    public Toucan2() {
    }
    
    public Header getHeader() {
        return this.header;
    }
    
    public int getWingspan() {
        return this.wingspan;
    }
    
    public void setHeader(Header header) {
        this.header = header;
    }
    
    public void setWingspan(int wingspan) {
        this.wingspan = wingspan;
    }
    
    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        buffer.put(BendecUtils.uInt16ToByteArray(this.wingspan));
        return buffer.array();
    }
    
    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        buffer.put(BendecUtils.uInt16ToByteArray(this.wingspan));
    }
    
    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("header", header.toJson());
        object.put("wingspan", wingspan);
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        object.put("wingspan", wingspan);
        return object;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(header,
        wingspan);
    }
    
    @Override
    public String toString() {
        return "Toucan2 {" +
            "header=" + header +
            ", wingspan=" + wingspan +
            "}";
    }
}