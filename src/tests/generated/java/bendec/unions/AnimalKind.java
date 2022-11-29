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
 * Enum: AnimalKind
 * undefined
 */
public enum AnimalKind {
    /**
     * This is a zebra
     */
    ZEBRA(4097),
    TOUCAN(4098),
    UNKNOWN(99999);

    private final int value;

    private final int byteLength = 2;


    private static final Map<Integer, AnimalKind> TYPES = new HashMap<>();
    static {
        for (AnimalKind type : AnimalKind.values()) {
            TYPES.put(type.value, type);
        }
    }


    AnimalKind(int newValue) {
        value = newValue;
    }

    /**
     Get AnimalKind from java input
     * @param newValue
     * @return AnimalKind enum
     */
    public static AnimalKind getAnimalKind(int newValue) {
        AnimalKind val = TYPES.get(newValue);
        return val == null ? AnimalKind.UNKNOWN : val;
    }

    /**
     * Get AnimalKind int value
     * @return int value
     */
    public int getAnimalKindValue() { return value; }


    /**
     Get AnimalKind from bytes
     * @param bytes byte[]
     * @param offset - int
     */
    public static AnimalKind getAnimalKind(byte[] bytes, int offset) {
        return getAnimalKind(BendecUtils.uInt16FromByteArray(bytes, offset));
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
