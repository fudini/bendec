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
 * Bitflags
 * undefined
 */
public class Bitflags {
    private int value;
    private final int byteLength = 1;
    
    public Bitflags(int value) {
        this.value = value;
    }

    public Bitflags(byte[] bytes, int offset) {
        this(BendecUtils.uInt8FromByteArray(bytes, offset));
    }

    public void add(BitflagsOptions flag) {
        this.value = this.value | flag.getOptionValue();
    }
    
    public void remove(BitflagsOptions flag) {
        this.value = this.value ^ flag.getOptionValue();
    }

    public Set<BitflagsOptions> getFlags() {
        HashSet<BitflagsOptions> options = new HashSet<>();
        for (BitflagsOptions option : BitflagsOptions.values()) {
            if (isAdded(option))
                options.add(option);
        }
        if (options.size() > 1)
            options.remove(BitflagsOptions.TYPES.get(0));
        return options;
    }

    public boolean isAdded(BitflagsOptions flag) {
        return (this.value | flag.getOptionValue()) == this.value;
    }

    public int getValue() {
        return value;
    }
    
    byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        buffer.put(BendecUtils.uInt8ToByteArray(this.value));
        return buffer.array();
    }
    
    void toBytes(ByteBuffer buffer) {
        buffer.put(BendecUtils.uInt8ToByteArray(this.value));
    }
    
    public ArrayNode toJson() {
        ArrayNode arrayNode = JsonSerializable.MAPPER.createArrayNode();
        this.getFlags().stream().map(Enum::toString).forEach(arrayNode::add);
        return arrayNode;
    }
    
    public enum BitflagsOptions {
        A(1),
        B(2),
        LONG(4);
        
        private final int optionValue;
        private static final Map<Integer, BitflagsOptions> TYPES = new HashMap<>();
        static {
            for (BitflagsOptions type : BitflagsOptions.values()) {
                TYPES.put(type.optionValue, type);
            }
        }
        
        /**
         * Get BitflagsOptions by attribute
         * @param val
         * @return BitflagsOptions enum or null if variant is undefined
         */
        public static BitflagsOptions getBitflags(int val) {
            return TYPES.get(val);
        }
        
        BitflagsOptions(int newValue) {
            this.optionValue = newValue;
        }
        
        public int getOptionValue() {
            return optionValue;
        }
    }
}