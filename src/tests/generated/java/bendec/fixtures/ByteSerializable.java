package bendec.fixtures;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;


public interface ByteSerializable {

    public int byteLength = 0;

    public abstract void toBytes(ByteBuffer buffer);

    public abstract byte[] toBytes();

}
