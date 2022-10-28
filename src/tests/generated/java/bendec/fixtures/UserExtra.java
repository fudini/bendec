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
 * <h2>UserExtra</h2>

 * <p>Byte length: 253</p>
 * <p>char > String (char[]) firstName - undefined | size 16</p>
 * <p>char > String (char[]) lastName - undefined | size 16</p>
 * <p>Uri uri - undefined | size 44</p>
 * <p>Age > int (u8) age - undefined | size 1</p>
 * <p>Uri > Uri [] (Uri[]) uris - undefined | size 176</p>
 * */

public class UserExtra implements ByteSerializable, JsonSerializable {

    private String firstName;
    private String lastName;
    private Uri uri;
    private int age;
    private Uri [] uris;
    public static final int byteLength = 253;

    public UserExtra(String firstName, String lastName, Uri uri, int age, Uri [] uris) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.uri = uri;
        this.age = age;
        this.uris = uris;
    }

    public UserExtra(byte[] bytes, int offset) {
        this.firstName = BendecUtils.stringFromByteArray(bytes, offset, 16);
        this.lastName = BendecUtils.stringFromByteArray(bytes, offset + 16, 16);
        this.uri = new Uri(bytes, offset + 32);
        this.age = BendecUtils.uInt8FromByteArray(bytes, offset + 76);
        this.uris = new Uri[4];
        for(int i = 0; i < 4; i++) {
            this.uris[i] = new Uri(bytes, offset + 77 + i * 44);
        }
    }

    public UserExtra(byte[] bytes) {
        this(bytes, 0);
    }

    public UserExtra() {
    }



    public String getFirstName() {
        return this.firstName;
    };
    public String getLastName() {
        return this.lastName;
    };
    public Uri getUri() {
        return this.uri;
    };
    public int getAge() {
        return this.age;
    };
    public Uri [] getUris() {
        return this.uris;
    };

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    };
    public void setLastName(String lastName) {
        this.lastName = lastName;
    };
    public void setUri(Uri uri) {
        this.uri = uri;
    };
    public void setAge(int age) {
        this.age = age;
    };
    public void setUris(Uri [] uris) {
        this.uris = uris;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.stringToByteArray(this.firstName, 16));
        buffer.put(BendecUtils.stringToByteArray(this.lastName, 16));
        uri.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.age));
        for(int i = 0; i < 4; i++) {
            uris[i].toBytes(buffer);
        }
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.stringToByteArray(this.firstName, 16));
        buffer.put(BendecUtils.stringToByteArray(this.lastName, 16));
        uri.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.age));
        for(int i = 0; i < 4; i++) {
            uris[i].toBytes(buffer);
        }
    }

    @Override  
    public ObjectNode toJson() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode object = mapper.createObjectNode();
        object.put("firstName", firstName);
        object.put("lastName", lastName);
        object.set("uri", uri.toJson());
        object.put("age", age);
        for(int i = 0; i < 4; i++) {
            object.set("uris[i]", uris[i].toJson());
        }
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.put("firstName", firstName);
        object.put("lastName", lastName);
        object.set("uri", uri.toJson());
        object.put("age", age);
        for(int i = 0; i < 4; i++) {
            object.set("uris[i]", uris[i].toJson());
        }
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(firstName, lastName, uri, age, uris);
    }

    @Override
    public String toString() {
        return "UserExtra{" +
            "firstName=" + firstName +
            ", lastName=" + lastName +
            ", uri=" + uri +
            ", age=" + age +
            ", uris=" + uris +
            '}';
        }
}
