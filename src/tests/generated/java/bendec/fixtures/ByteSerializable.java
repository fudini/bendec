  package bendec.fixtures;

import java.math.BigInteger;
import java.util.*;
import java.nio.ByteBuffer;

public interface ByteSerializable {

    public int byteLength = 0;

    public abstract void toBytes(ByteBuffer buffer);
    public abstract byte[] toBytes();

}