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
 * <h2>Toucan</h2>

 * <p>Byte length: 4</p>
 * <p>AnimalKind kind | size 2</p>
 * <p>u16 > int wingspan | size 2</p>
 */
public class Toucan implements ByteSerializable, JsonSerializable, Animal {
    private AnimalKind kind;
    private int wingspan;
    public static final int byteLength = 4;

    public Toucan(AnimalKind kind, int wingspan) {
        this.kind = kind;
        this.wingspan = wingspan;
    }

    public Toucan(byte[] bytes, int offset) {
        this.kind = AnimalKind.getAnimalKind(bytes, offset);
        this.wingspan = BendecUtils.uInt16FromByteArray(bytes, offset + 2);
    }

    public Toucan(byte[] bytes) {
        this(bytes, 0);
    }

    public Toucan() {
    }

    public AnimalKind getKind() {
        return this.kind;
    }

    public int getWingspan() {
        return this.wingspan;
    }

    public void setKind(AnimalKind kind) {
        this.kind = kind;
    }

    public void setWingspan(int wingspan) {
        this.wingspan = wingspan;
    }

    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        kind.toBytes(buffer);
        buffer.put(BendecUtils.uInt16ToByteArray(this.wingspan));
        return buffer.array();
    }

    @Override
    public void toBytes(ByteBuffer buffer) {
        kind.toBytes(buffer);
        buffer.put(BendecUtils.uInt16ToByteArray(this.wingspan));
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("kind", kind.toJson());
        object.put("wingspan", wingspan);
        return object;
    }

    @Override
    public ObjectNode toJson(ObjectNode object) {
        object.set("kind", kind.toJson());
        object.put("wingspan", wingspan);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(kind,
        wingspan);
    }

    @Override
    public String toString() {
        return "Toucan {" +
            "kind=" + kind +
            ", wingspan=" + wingspan +
            "}";
    }
}