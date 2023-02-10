package bendec.fixtures;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.fixtures.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;


/**
 * <h2>Group</h2>

 * <p>Byte length: 394</p>
 * <p>Header header | size 1</p>
 * <p>u8 > String (u8[]) ints | size 8</p>
 * <p>User > User[] (User[]) users | size 385</p>
 * */

public class Group implements ByteSerializable, JsonSerializable {

    private Header header;
    private String ints;
    private User[] users;
    public static final int byteLength = 394;

    public Group(Header header, String ints, User[] users) {
        this.header = header;
        this.ints = ints;
        this.users = users;
    }

    public Group(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.ints = BendecUtils.stringFromByteArray(bytes, offset + 1, 8);
        this.users = new User[5];
        for(int i = 0; i < users.length; i++) {
            this.users[i] = new User(bytes, offset + 9 + i * 77);
        }
    }

    public Group(byte[] bytes) {
        this(bytes, 0);
    }

    public Group() {
    }



    public Header getHeader() {
        return this.header;
    };
    public String getInts() {
        return this.ints;
    };
    public User[] getUsers() {
        return this.users;
    };

    public void setHeader(Header header) {
        this.header = header;
    };
    public void setInts(String ints) {
        this.ints = ints;
    };
    public void setUsers(User[] users) {
        this.users = users;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        buffer.put(BendecUtils.stringToByteArray(this.ints, 8));
        for(int i = 0; i < users.length; i++) {
            users[i].toBytes(buffer);
        }
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        buffer.put(BendecUtils.stringToByteArray(this.ints, 8));
        for(int i = 0; i < users.length; i++) {
            users[i].toBytes(buffer);
        }
    }

    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("header", header.toJson());
        object.put("ints", ints);
        ArrayNode arrayUsers=JsonSerializable.MAPPER.createArrayNode();
        for(int i = 0; i < users.length; i++) {
            arrayUsers.add(users[i].toJson());
        }
        object.set("users", arrayUsers);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        object.put("ints", ints);
        ArrayNode arrayUsers=JsonSerializable.MAPPER.createArrayNode();
        for(int i = 0; i < users.length; i++) {
            arrayUsers.add(users[i].toJson());
        }
        object.set("users", arrayUsers);
        return object;
    }

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
