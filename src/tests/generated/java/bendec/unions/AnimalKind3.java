package bendec.unions;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * Enum: AnimalKind3
 * undefined
 */
public enum AnimalKind3 {
    ZEBRA3(8193),
    TOUCAN3(8194),
    UNKNOWN(99999);

    private final int value;

    private final int byteLength = 2;


    private static final Map<Integer, AnimalKind3> TYPES = new HashMap<>();
    static {
        for (AnimalKind3 type : AnimalKind3.values()) {
            TYPES.put(type.value, type);
        }
    }


    AnimalKind3(int newValue) {
        value = newValue;
    }

    /**
     Get AnimalKind3 from java input
     * @param newValue
     * @return AnimalKind3 enum
     */
    public static AnimalKind3 getAnimalKind3(int newValue) {
        AnimalKind3 val = TYPES.get(newValue);
        return val == null ? AnimalKind3.UNKNOWN : val;
    }

    /**
     * Get AnimalKind3 int value
     * @return int value
     */
    public int getAnimalKind3Value() { return value; }


    /**
     Get AnimalKind3 from bytes
     * @param bytes byte[]
     * @param offset - int
     */
    public static AnimalKind3 getAnimalKind3(byte[] bytes, int offset) {
        return getAnimalKind3(BendecUtils.uInt16FromByteArray(bytes, offset));
    }

    byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.uInt16ToByteArray(this.value));
        return buffer.array();
    }

    void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.uInt16ToByteArray(this.value));
    }


    public TextNode toJson() {
        return JsonNodeFactory.instance.textNode(name());
    }

}
