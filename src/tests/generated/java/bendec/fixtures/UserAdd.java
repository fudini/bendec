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
 * <h2>UserAdd</h2>
 
 * <p>Byte length: 78</p>
 * <p>Header header | size 1</p>
 * <p>User user | size 77</p>
 */
public class UserAdd implements ByteSerializable, JsonSerializable {
    private Header header;
    private User user;
    public static final int byteLength = 78;
    
    public UserAdd(Header header, User user) {
        this.header = header;
        this.user = user;
    }
    
    public UserAdd(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.user = new User(bytes, offset + 1);
    }
    
    public UserAdd(byte[] bytes) {
        this(bytes, 0);
    }
    
    public UserAdd() {
    }
    
    public Header getHeader() {
        return this.header;
    }
    
    public User getUser() {
        return this.user;
    }
    
    public void setHeader(Header header) {
        this.header = header;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        user.toBytes(buffer);
        return buffer.array();
    }
    
    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        user.toBytes(buffer);
    }
    
    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("header", header.toJson());
        object.set("user", user.toJson());
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        object.set("user", user.toJson());
        return object;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(header,
        user);
    }
    
    @Override
    public String toString() {
        return "UserAdd {" +
            "header=" + header +
            ", user=" + user +
            "}";
    }
}