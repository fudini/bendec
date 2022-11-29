package bendec.fixtures;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.fixtures.JsonSerializable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;


/**
 * <h2>Group</h2>

 * <p>Byte length: 394</p>
 * <p>Header header - undefined | size 1</p>
 * <p>u8 > int [] (u8[]) ints - undefined | size 8</p>
 * <p>User > User [] (User[]) users - undefined | size 385</p>
 * */

public class Group implements ByteSerializable, JsonSerializable {

    private Header header;
    private int [] ints;
    private User [] users;
    public static final int byteLength = 394;

    public Group(Header header, int [] ints, User [] users) {
        this.header = header;
        this.ints = ints;
        this.users = users;
        this.header.setLength(this.byteLength);
        this.header.setMsgType(MsgType.GROUP);
    }

    public Group(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.ints = new int[8];
        for(int i = 0; i < 8; i++) {
            this.ints[i] = BendecUtils.uInt8FromByteArray(bytes, offset + 1 + i * 1);
        }
        this.users = new User[5];
        for(int i = 0; i < 5; i++) {
            this.users[i] = new User(bytes, offset + 9 + i * 77);
        }
        this.header.setLength(this.byteLength);
        this.header.setMsgType(MsgType.GROUP);
    }

    public Group(byte[] bytes) {
        this(bytes, 0);
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

    public void setHeader(Header header) {
        this.header = header;
    };
    public void setInts(int [] ints) {
        this.ints = ints;
    };
    public void setUsers(User [] users) {
        this.users = users;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        for(int i = 0; i < 8; i++) {
            buffer.put(BendecUtils.uInt8ToByteArray(this.ints[i]));
        }
        for(int i = 0; i < 5; i++) {
            users[i].toBytes(buffer);
        }
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        for(int i = 0; i < 8; i++) {
            buffer.put(BendecUtils.uInt8ToByteArray(this.ints[i]));
        }
        for(int i = 0; i < 5; i++) {
            users[i].toBytes(buffer);
        }
    }

    @Override  
    public ObjectNode toJson() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode object = mapper.createObjectNode();
        object.set("header", header.toJson());
        for(int i = 0; i < 8; i++) {
            object.put("ints[i]", ints[i]);
        }
        for(int i = 0; i < 5; i++) {
            object.set("users[i]", users[i].toJson());
        }
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        for(int i = 0; i < 8; i++) {
            object.put("ints[i]", ints[i]);
        }
        for(int i = 0; i < 5; i++) {
            object.set("users[i]", users[i].toJson());
        }
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
