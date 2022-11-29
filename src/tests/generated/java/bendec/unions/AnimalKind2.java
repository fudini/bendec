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
 * Enum: AnimalKind2
 * undefined
 */
public enum AnimalKind2 {
    ZEBRA2(1),
    TOUCAN2(2),
    UNKNOWN(99999);

    private final int value;

    private final int byteLength = 1;


    private static final Map<Integer, AnimalKind2> TYPES = new HashMap<>();
    static {
        for (AnimalKind2 type : AnimalKind2.values()) {
            TYPES.put(type.value, type);
        }
    }


    AnimalKind2(int newValue) {
        value = newValue;
    }

    /**
     Get AnimalKind2 from java input
     * @param newValue
     * @return AnimalKind2 enum
     */
    public static AnimalKind2 getAnimalKind2(int newValue) {
        AnimalKind2 val = TYPES.get(newValue);
        return val == null ? AnimalKind2.UNKNOWN : val;
    }

    /**
     * Get AnimalKind2 int value
     * @return int value
     */
    public int getAnimalKind2Value() { return value; }


    /**
     Get AnimalKind2 from bytes
     * @param bytes byte[]
     * @param offset - int
     */
    public static AnimalKind2 getAnimalKind2(byte[] bytes, int offset) {
        return getAnimalKind2(BendecUtils.uInt8FromByteArray(bytes, offset));
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
