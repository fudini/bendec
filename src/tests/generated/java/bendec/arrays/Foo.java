package bendec.arrays;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.arrays.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;


/**
 * <h2>Foo</h2>
 * <p>This is the description of the struct Foo</p>
 * <p>Byte length: 274</p>
 * <p>Ident > Test[] (Test[]) id1 | size 6</p>
 * <p>Test3 > Test[] (Test[]) id2 | size 6</p>
 * <p>Char3 > String (u8[]) id3 | size 3</p>
 * <p>char > String (u8[]) id4 | size 3</p>
 * <p>BigArray > String (u8[]) id5 | size 128</p>
 * <p>BigArrayNewtype > String (u8[]) id6 | size 128</p>
 * */

public class Foo implements ByteSerializable, JsonSerializable {

    private Test[] id1;
    private Test[] id2;
    private String id3;
    private String id4;
    private String id5;
    private String id6;
    public static final int byteLength = 274;

    public Foo(Test[] id1, Test[] id2, String id3, String id4, String id5, String id6) {
        this.id1 = id1;
        this.id2 = id2;
        this.id3 = id3;
        this.id4 = id4;
        this.id5 = id5;
        this.id6 = id6;
    }

    public Foo(byte[] bytes, int offset) {
        this.id1 = new Test[3];
        for(int i = 0; i < id1.length; i++) {
            this.id1[i] = new Test(bytes, offset + i * 2);
        }
        this.id2 = new Test[3];
        for(int i = 0; i < id2.length; i++) {
            this.id2[i] = new Test(bytes, offset + 6 + i * 2);
        }
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



    public Test[] getId1() {
        return this.id1;
    };
    public Test[] getId2() {
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

    public void setId1(Test[] id1) {
        this.id1 = id1;
    };
    public void setId2(Test[] id2) {
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
        for(int i = 0; i < id1.length; i++) {
            id1[i].toBytes(buffer);
        }
        for(int i = 0; i < id2.length; i++) {
            id2[i].toBytes(buffer);
        }
        buffer.put(BendecUtils.stringToByteArray(this.id3, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id4, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id5, 128));
        buffer.put(BendecUtils.stringToByteArray(this.id6, 128));
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        for(int i = 0; i < id1.length; i++) {
            id1[i].toBytes(buffer);
        }
        for(int i = 0; i < id2.length; i++) {
            id2[i].toBytes(buffer);
        }
        buffer.put(BendecUtils.stringToByteArray(this.id3, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id4, 3));
        buffer.put(BendecUtils.stringToByteArray(this.id5, 128));
        buffer.put(BendecUtils.stringToByteArray(this.id6, 128));
    }

    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        ArrayNode arrayId1=JsonSerializable.MAPPER.createArrayNode();
        for(int i = 0; i < id1.length; i++) {
            arrayId1.add(id1[i].toJson());
        }
        object.set("id1", arrayId1);
        ArrayNode arrayId2=JsonSerializable.MAPPER.createArrayNode();
        for(int i = 0; i < id2.length; i++) {
            arrayId2.add(id2[i].toJson());
        }
        object.set("id2", arrayId2);
        object.put("id3", id3);
        object.put("id4", id4);
        object.put("id5", id5);
        object.put("id6", id6);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        ArrayNode arrayId1=JsonSerializable.MAPPER.createArrayNode();
        for(int i = 0; i < id1.length; i++) {
            arrayId1.add(id1[i].toJson());
        }
        object.set("id1", arrayId1);
        ArrayNode arrayId2=JsonSerializable.MAPPER.createArrayNode();
        for(int i = 0; i < id2.length; i++) {
            arrayId2.add(id2[i].toJson());
        }
        object.set("id2", arrayId2);
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
