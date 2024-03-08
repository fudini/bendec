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
 * <h2>Zebra</h2>
 
 * <p>Byte length: 3</p>
 * <p>AnimalKind kind | size 2</p>
 * <p>u8 > int legs | size 1</p>
 */
public class Zebra implements ByteSerializable, JsonSerializable, Animal {
    private AnimalKind kind;
    private int legs;
    public static final int byteLength = 3;
    
    public Zebra(AnimalKind kind, int legs) {
        this.kind = kind;
        this.legs = legs;
    }
    
    public Zebra(byte[] bytes, int offset) {
        this.kind = AnimalKind.getAnimalKind(bytes, offset);
        this.legs = BendecUtils.uInt8FromByteArray(bytes, offset + 2);
    }
    
    public Zebra(byte[] bytes) {
        this(bytes, 0);
    }
    
    public Zebra() {
    }
    
    public AnimalKind getKind() {
        return this.kind;
    }
    
    public int getLegs() {
        return this.legs;
    }
    
    public void setKind(AnimalKind kind) {
        this.kind = kind;
    }
    
    public void setLegs(int legs) {
        this.legs = legs;
    }
    
    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        kind.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.legs));
        return buffer.array();
    }
    
    @Override  
    public void toBytes(ByteBuffer buffer) {
        kind.toBytes(buffer);
        buffer.put(BendecUtils.uInt8ToByteArray(this.legs));
    }
    
    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("kind", kind.toJson());
        object.put("legs", legs);
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("kind", kind.toJson());
        object.put("legs", legs);
        return object;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(kind,
        legs);
    }
    
    @Override
    public String toString() {
        return "Zebra {" +
            "kind=" + kind +
            ", legs=" + legs +
            "}";
    }
}