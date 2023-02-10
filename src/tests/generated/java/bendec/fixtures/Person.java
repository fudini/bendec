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
 * <h2>Person</h2>

 * <p>Byte length: 11</p>
 * <p>u16 > int a | size 2</p>
 * <p>u32 > long b | size 4</p>
 * <p>u32 > long c | size 4</p>
 * <p>u8 > int d | size 1</p>
 * */

public class Person implements ByteSerializable, JsonSerializable {

    private int a;
    private long b;
    private long c;
    private int d;
    public static final int byteLength = 11;

    public Person(int a, long b, long c, int d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    public Person(byte[] bytes, int offset) {
        this.a = BendecUtils.uInt16FromByteArray(bytes, offset);
        this.b = BendecUtils.uInt32FromByteArray(bytes, offset + 2);
        this.c = BendecUtils.uInt32FromByteArray(bytes, offset + 6);
        this.d = BendecUtils.uInt8FromByteArray(bytes, offset + 10);
    }

    public Person(byte[] bytes) {
        this(bytes, 0);
    }

    public Person() {
    }



    public int getA() {
        return this.a;
    };
    public long getB() {
        return this.b;
    };
    public long getC() {
        return this.c;
    };
    public int getD() {
        return this.d;
    };

    public void setA(int a) {
        this.a = a;
    };
    public void setB(long b) {
        this.b = b;
    };
    public void setC(long c) {
        this.c = c;
    };
    public void setD(int d) {
        this.d = d;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.uInt16ToByteArray(this.a));
        buffer.put(BendecUtils.uInt32ToByteArray(this.b));
        buffer.put(BendecUtils.uInt32ToByteArray(this.c));
        buffer.put(BendecUtils.uInt8ToByteArray(this.d));
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.uInt16ToByteArray(this.a));
        buffer.put(BendecUtils.uInt32ToByteArray(this.b));
        buffer.put(BendecUtils.uInt32ToByteArray(this.c));
        buffer.put(BendecUtils.uInt8ToByteArray(this.d));
    }

    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.put("a", a);
        object.put("b", b);
        object.put("c", c);
        object.put("d", d);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.put("a", a);
        object.put("b", b);
        object.put("c", c);
        object.put("d", d);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(a, b, c, d);
    }

    @Override
    public String toString() {
        return "Person{" +
            "a=" + a +
            ", b=" + b +
            ", c=" + c +
            ", d=" + d +
            '}';
        }
}
