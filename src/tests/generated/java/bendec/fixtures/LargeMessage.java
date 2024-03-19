package bendec.fixtures;

import java.math.BigInteger;
import java.util.*;
import java.nio.ByteBuffer;
import bendec.fixtures.JsonSerializable;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * <h2>LargeMessage</h2>
 
 * <p>Byte length: 301</p>
 * <p>Header header | size 1</p>
 * <p>Person person1 | size 11</p>
 * <p>Person person2 | size 11</p>
 * <p>u32 > long aaa | size 4</p>
 * <p>Price > long (u32) bbb | size 4</p>
 * <p>u32 > long ccc | size 4</p>
 * <p>u32 > long ddd | size 4</p>
 * <p>u32 > long eee | size 4</p>
 * <p>u8 > int fff | size 1</p>
 * <p>u8 > int ggg | size 1</p>
 * <p>char > String (u8[]) name1 | size 64</p>
 * <p>char > String (u8[]) name2 | size 64</p>
 * <p>char > String (u8[]) name3 | size 64</p>
 * <p>char > String (u8[]) name4 | size 64</p>
 */
public class LargeMessage implements ByteSerializable, JsonSerializable {
    private Header header;
    private Person person1;
    private Person person2;
    private long aaa;
    private long bbb;
    private long ccc;
    private long ddd;
    private long eee;
    private int fff;
    private int ggg;
    private String name1;
    private String name2;
    private String name3;
    private String name4;
    public static final int byteLength = 301;
    
    public LargeMessage(Header header, Person person1, Person person2, long aaa, long bbb, long ccc, long ddd, long eee, int fff, int ggg, String name1, String name2, String name3, String name4) {
        this.header = header;
        this.person1 = person1;
        this.person2 = person2;
        this.aaa = aaa;
        this.bbb = bbb;
        this.ccc = ccc;
        this.ddd = ddd;
        this.eee = eee;
        this.fff = fff;
        this.ggg = ggg;
        this.name1 = name1;
        this.name2 = name2;
        this.name3 = name3;
        this.name4 = name4;
    }
    
    public LargeMessage(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.person1 = new Person(bytes, offset + 1);
        this.person2 = new Person(bytes, offset + 12);
        this.aaa = BendecUtils.uInt32FromByteArray(bytes, offset + 23);
        this.bbb = BendecUtils.uInt32FromByteArray(bytes, offset + 27);
        this.ccc = BendecUtils.uInt32FromByteArray(bytes, offset + 31);
        this.ddd = BendecUtils.uInt32FromByteArray(bytes, offset + 35);
        this.eee = BendecUtils.uInt32FromByteArray(bytes, offset + 39);
        this.fff = BendecUtils.uInt8FromByteArray(bytes, offset + 43);
        this.ggg = BendecUtils.uInt8FromByteArray(bytes, offset + 44);
        this.name1 = BendecUtils.stringFromByteArray(bytes, offset + 45, 64);
        this.name2 = BendecUtils.stringFromByteArray(bytes, offset + 109, 64);
        this.name3 = BendecUtils.stringFromByteArray(bytes, offset + 173, 64);
        this.name4 = BendecUtils.stringFromByteArray(bytes, offset + 237, 64);
    }
    
    public LargeMessage(byte[] bytes) {
        this(bytes, 0);
    }
    
    public LargeMessage() {
    }
    
    public Header getHeader() {
        return this.header;
    }
    
    public Person getPerson1() {
        return this.person1;
    }
    
    public Person getPerson2() {
        return this.person2;
    }
    
    public long getAaa() {
        return this.aaa;
    }
    
    public long getBbb() {
        return this.bbb;
    }
    
    public long getCcc() {
        return this.ccc;
    }
    
    public long getDdd() {
        return this.ddd;
    }
    
    public long getEee() {
        return this.eee;
    }
    
    public int getFff() {
        return this.fff;
    }
    
    public int getGgg() {
        return this.ggg;
    }
    
    public String getName1() {
        return this.name1;
    }
    
    public String getName2() {
        return this.name2;
    }
    
    public String getName3() {
        return this.name3;
    }
    
    public String getName4() {
        return this.name4;
    }
    
    public void setHeader(Header header) {
        this.header = header;
    }
    
    public void setPerson1(Person person1) {
        this.person1 = person1;
    }
    
    public void setPerson2(Person person2) {
        this.person2 = person2;
    }
    
    public void setAaa(long aaa) {
        this.aaa = aaa;
    }
    
    public void setBbb(long bbb) {
        this.bbb = bbb;
    }
    
    public void setCcc(long ccc) {
        this.ccc = ccc;
    }
    
    public void setDdd(long ddd) {
        this.ddd = ddd;
    }
    
    public void setEee(long eee) {
        this.eee = eee;
    }
    
    public void setFff(int fff) {
        this.fff = fff;
    }
    
    public void setGgg(int ggg) {
        this.ggg = ggg;
    }
    
    public void setName1(String name1) {
        this.name1 = name1;
    }
    
    public void setName2(String name2) {
        this.name2 = name2;
    }
    
    public void setName3(String name3) {
        this.name3 = name3;
    }
    
    public void setName4(String name4) {
        this.name4 = name4;
    }
    
    @Override
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        person1.toBytes(buffer);
        person2.toBytes(buffer);
        buffer.put(BendecUtils.uInt32ToByteArray(this.aaa));
        buffer.put(BendecUtils.uInt32ToByteArray(this.bbb));
        buffer.put(BendecUtils.uInt32ToByteArray(this.ccc));
        buffer.put(BendecUtils.uInt32ToByteArray(this.ddd));
        buffer.put(BendecUtils.uInt32ToByteArray(this.eee));
        buffer.put(BendecUtils.uInt8ToByteArray(this.fff));
        buffer.put(BendecUtils.uInt8ToByteArray(this.ggg));
        buffer.put(BendecUtils.stringToByteArray(this.name1, 64));
        buffer.put(BendecUtils.stringToByteArray(this.name2, 64));
        buffer.put(BendecUtils.stringToByteArray(this.name3, 64));
        buffer.put(BendecUtils.stringToByteArray(this.name4, 64));
        return buffer.array();
    }
    
    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        person1.toBytes(buffer);
        person2.toBytes(buffer);
        buffer.put(BendecUtils.uInt32ToByteArray(this.aaa));
        buffer.put(BendecUtils.uInt32ToByteArray(this.bbb));
        buffer.put(BendecUtils.uInt32ToByteArray(this.ccc));
        buffer.put(BendecUtils.uInt32ToByteArray(this.ddd));
        buffer.put(BendecUtils.uInt32ToByteArray(this.eee));
        buffer.put(BendecUtils.uInt8ToByteArray(this.fff));
        buffer.put(BendecUtils.uInt8ToByteArray(this.ggg));
        buffer.put(BendecUtils.stringToByteArray(this.name1, 64));
        buffer.put(BendecUtils.stringToByteArray(this.name2, 64));
        buffer.put(BendecUtils.stringToByteArray(this.name3, 64));
        buffer.put(BendecUtils.stringToByteArray(this.name4, 64));
    }
    
    @Override  
    public ObjectNode toJson() {
        ObjectNode object = JsonSerializable.MAPPER.createObjectNode();
        object.set("header", header.toJson());
        object.set("person1", person1.toJson());
        object.set("person2", person2.toJson());
        object.put("aaa", aaa);
        object.put("bbb", bbb);
        object.put("ccc", ccc);
        object.put("ddd", ddd);
        object.put("eee", eee);
        object.put("fff", fff);
        object.put("ggg", ggg);
        object.put("name1", name1);
        object.put("name2", name2);
        object.put("name3", name3);
        object.put("name4", name4);
        return object;
    }
    
    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        object.set("person1", person1.toJson());
        object.set("person2", person2.toJson());
        object.put("aaa", aaa);
        object.put("bbb", bbb);
        object.put("ccc", ccc);
        object.put("ddd", ddd);
        object.put("eee", eee);
        object.put("fff", fff);
        object.put("ggg", ggg);
        object.put("name1", name1);
        object.put("name2", name2);
        object.put("name3", name3);
        object.put("name4", name4);
        return object;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(header,
        person1,
        person2,
        aaa,
        bbb,
        ccc,
        ddd,
        eee,
        fff,
        ggg,
        name1,
        name2,
        name3,
        name4);
    }
    
    @Override
    public String toString() {
        return "LargeMessage {" +
            "header=" + header +
            ", person1=" + person1 +
            ", person2=" + person2 +
            ", aaa=" + aaa +
            ", bbb=" + bbb +
            ", ccc=" + ccc +
            ", ddd=" + ddd +
            ", eee=" + eee +
            ", fff=" + fff +
            ", ggg=" + ggg +
            ", name1=" + name1 +
            ", name2=" + name2 +
            ", name3=" + name3 +
            ", name4=" + name4 +
            "}";
    }
}