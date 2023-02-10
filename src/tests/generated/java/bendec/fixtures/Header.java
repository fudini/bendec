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
 * <h2>Header</h2>
 * <p>struct description</p>
 * <p>Byte length: 1</p>
 * <p>u8 > int msgType - field description | size 1</p>
 * */

public class Header implements ByteSerializable, JsonSerializable {

    private int msgType;
    public static final int byteLength = 1;

    public Header(int msgType) {
        this.msgType = msgType;
    }

    public Header(byte[] bytes, int offset) {
        this.msgType = BendecUtils.uInt8FromByteArray(bytes, offset);
    }

    public Header(byte[] bytes) {
        this(bytes, 0);
    }

    public Header() {
    }



    /**
     * @return field description
     */
    public int getMsgType() {
        return this.msgType;
    };

    /**
     * @param msgType field description
     */
    public void setMsgType(int msgType) {
        this.msgType = msgType;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.uInt8ToByteArray(this.msgType));
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.uInt8ToByteArray(this.msgType));
    }

    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.put("msgType", msgType);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.put("msgType", msgType);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(msgType);
    }

    @Override
    public String toString() {
        return "Header{" +
            "msgType=" + msgType +
            '}';
        }
}
