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
 * <h2>User</h2>

 * <p>Byte length: 77</p>
 * <p>char > String (u8[]) firstName | size 16</p>
 * <p>char > String (u8[]) lastName | size 16</p>
 * <p>Uri uri | size 44</p>
 * <p>Age > int (u8) age | size 1</p>
 */
public class User implements ByteSerializable, JsonSerializable {
    private String firstName;
    private String lastName;
    private Uri uri;
    private int age;
    public static final int byteLength = 77;

    public User(String firstName, String lastName, Uri uri, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.uri = uri;
        this.age = age;
    }

    public User(byte[] bytes, int offset) {
        this.firstName = BendecUtils.stringFromByteArray(bytes, offset, 16);
        this.lastName = BendecUtils.stringFromByteArray(bytes, offset + 16, 16);
        this.uri = new Uri(bytes, offset + 32);
        this.age = BendecUtils.uInt8FromByteArray(bytes, offset + 76);
    }

    public User(byte[] bytes) {
        this(bytes, 0);
    }

    public User() {
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Uri getUri() {
        return this.uri;
    }

    public int getAge() {
        return this.age;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setUri(Uri uri) {
        this.uri = uri;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.stringToByteArray(this.firstName, 16));
        buffer.put(BendecUtils.stringToByteArray(this.lastName, 16));
        uri.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.age));
        return buffer.array();
    }

    @Override
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.stringToByteArray(this.firstName, 16));
        buffer.put(BendecUtils.stringToByteArray(this.lastName, 16));
        uri.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.age));
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.put("firstName", firstName);
        object.put("lastName", lastName);
        object.set("uri", uri.toJson());
        object.put("age", age);
        return object;
    }

    @Override
    public ObjectNode toJson(ObjectNode object) {
        object.put("firstName", firstName);
        object.put("lastName", lastName);
        object.set("uri", uri.toJson());
        object.put("age", age);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(firstName,
        lastName,
        uri,
        age);
    }

    @Override
    public String toString() {
        return "User {" +
            "firstName=" + firstName +
            ", lastName=" + lastName +
            ", uri=" + uri +
            ", age=" + age +
            "}";
    }
}