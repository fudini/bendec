package bendec.unions;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * Enum: Bitflags
 * undefined
 */
public enum Bitflags {
    A(1),
    B(2),
    LONG(4),
    UNKNOWN(99999);

    private final int value;

    private final int byteLength = 1;


    private static final Map<Integer, Bitflags> TYPES = new HashMap<>();
    static {
        for (Bitflags type : Bitflags.values()) {
            TYPES.put(type.value, type);
        }
    }


    Bitflags(int newValue) {
        value = newValue;
    }

    /**
     Get Bitflags from java input
     * @param newValue
     * @return Bitflags enum
     */
    public static Bitflags getBitflags(int newValue) {
        Bitflags val = TYPES.get(newValue);
        return val == null ? Bitflags.UNKNOWN : val;
    }

    /**
     * Get Bitflags int value
     * @return int value
     */
    public int getBitflagsValue() { return value; }


    /**
     Get Bitflags from bytes
     * @param bytes byte[]
     * @param offset - int
     */
    public static Bitflags getBitflags(byte[] bytes, int offset) {
        return getBitflags(BendecUtils.uInt8FromByteArray(bytes, offset));
    }

    byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.uInt8ToByteArray(this.value));
        return buffer.array();
    }

    void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.uInt8ToByteArray(this.value));
    }


    public TextNode toJson() {
        return JsonNodeFactory.instance.textNode(name());
    }

}
