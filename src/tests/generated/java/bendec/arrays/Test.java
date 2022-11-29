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
 * <h2>Test</h2>

 * <p>Byte length: 2</p>
 * <p>u8 > int one - undefined | size 1</p>
 * <p>u8 > int two - undefined | size 1</p>
 * */

public class Test implements ByteSerializable, JsonSerializable {

    private int one;
    private int two;
    public static final int byteLength = 2;

    public Test(int one, int two) {
        this.one = one;
        this.two = two;
    }

    public Test(byte[] bytes, int offset) {
        this.one = BendecUtils.uInt8FromByteArray(bytes, offset);
        this.two = BendecUtils.uInt8FromByteArray(bytes, offset + 1);
    }

    public Test(byte[] bytes) {
        this(bytes, 0);
    }

    public Test() {
    }



    public int getOne() {
        return this.one;
    };
    public int getTwo() {
        return this.two;
    };

    public void setOne(int one) {
        this.one = one;
    };
    public void setTwo(int two) {
        this.two = two;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.uInt8ToByteArray(this.one));
        buffer.put(BendecUtils.uInt8ToByteArray(this.two));
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.uInt8ToByteArray(this.one));
        buffer.put(BendecUtils.uInt8ToByteArray(this.two));
    }

    @Override  
    public ObjectNode toJson() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode object = mapper.createObjectNode();
        object.put("one", one);
        object.put("two", two);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.put("one", one);
        object.put("two", two);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(one, two);
    }

    @Override
    public String toString() {
        return "Test{" +
            "one=" + one +
            ", two=" + two +
            '}';
        }
}
