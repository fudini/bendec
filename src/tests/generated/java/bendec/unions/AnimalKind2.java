package bendec.unions;

import java.math.BigInteger;
import java.util.*;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
    TOUCAN2(2);
    
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
     * Get AnimalKind2 by attribute
     * @param val
     * @return AnimalKind2 enum or null if variant is undefined
     */
    public static AnimalKind2 getAnimalKind2(int val) {
        return TYPES.get(val);
    }
    
    /**
     * Get AnimalKind2 int value
     * @return int value
     */
    public int getAnimalKind2Value() {
        return value; 
    }
    
    /**
     * Get AnimalKind2 from bytes
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