package bendec.arrays;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.arrays.JsonSerializable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;


/**
 * <h2>Foo</h2>
 * <p>This is the description of the struct Foo</p>
 * <p>Byte length: 274</p>
 * <p>Ident > String (char[]) id1 - undefined | size 6</p>
 * <p>Test3 > String (char[]) id2 - undefined | size 6</p>
 * <p>Char3 > String (char[]) id3 - undefined | size 3</p>
 * <p>char > String (char[]) id4 - undefined | size 3</p>
 * <p>BigArray > String (char[]) id5 - undefined | size 128</p>
 * <p>BigArrayNewtype > String (char[]) id6 - undefined | size 128</p>
 * */

public class Foo implements ByteSerializable, JsonSerializable {

    private String id1;
    private String id2;
    private String id3;
    private String id4;
    private String id5;
    private String id6;
    public static final int byteLength = 274;

    public Foo(String id1, String id2, String id3, String id4, String id5, String id6) {
        this.id1 = id1;
        this.id2 = id2;
        this.id3 = id3;
        this.id4 = id4;
        this.id5 = id5;
        this.id6 = id6;
    }

    public Foo(byte[] bytes, int offset) {
        this.id1 = BendecUtils.stringFromByteArray(bytes, offset, undefined);
        this.id2 = BendecUtils.stringFromByteArray(bytes, offset + 6, 3);
        this.id3 = BendecUtils.stringFromByteArray(bytes, offset + 12, 3);
        this.id4 = BendecUtils.stringFromByteArray(bytes, offset + 15, 3);
        this.id5 = BendecUtils.stringFromByteArray(bytes, offset + 18, 128);
        this.id6 = BendecUtils.stringFromByteArray(bytes, offset + 146, 128);
    }

    public Foo(byte[] bytes) {
        this(bytes, 0);
    }

    public Foo() {
    }



    public String getId1() {
        return this.id1;
    };
    public String getId2() {
        return this.id2;
    };
    public String getId3() {
        return this.id3;
    };
    public String getId4() {
        return this.id4;
    };
    public String getId5() {
        return this.id5;
    };
    public String getId6() {
        return this.id6;
    };

    public void setId1(String id1) {
        this.id1 = id1;
    };
    public void setId2(String id2) {
        this.id2 = id2;
    };
    public void setId3(String id3) {
        this.id3 = id3;
    };
    public void setId4(String id4) {
        this.id4 = id4;
    };
    public void setId5(String id5) {
        this.id5 = id5;
    };
    public void setId6(String id6) {
        this.id6 = id6;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.stringToByteArray(this.id1, 0));
        buffer.put(BendecUtils.stringToByteArray(this.id2, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id3, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id4, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id5, 128));
        buffer.put(BendecUtils.stringToByteArray(this.id6, 128));
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.stringToByteArray(this.id1, 0));
        buffer.put(BendecUtils.stringToByteArray(this.id2, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id3, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id4, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id5, 128));
        buffer.put(BendecUtils.stringToByteArray(this.id6, 128));
    }

    @Override  
    public ObjectNode toJson() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode object = mapper.createObjectNode();
        object.put("id1", id1);
        object.put("id2", id2);
        object.put("id3", id3);
        object.put("id4", id4);
        object.put("id5", id5);
        object.put("id6", id6);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.put("id1", id1);
        object.put("id2", id2);
        object.put("id3", id3);
        object.put("id4", id4);
        object.put("id5", id5);
        object.put("id6", id6);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id1, id2, id3, id4, id5, id6);
    }

    @Override
    public String toString() {
        return "Foo{" +
            "id1=" + id1 +
            ", id2=" + id2 +
            ", id3=" + id3 +
            ", id4=" + id4 +
            ", id5=" + id5 +
            ", id6=" + id6 +
            '}';
        }
}
