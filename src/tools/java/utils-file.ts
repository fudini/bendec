export const utilsFile = `
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Utils {

    public static byte[] uInt8ToByteArray(int value) {
        return new byte[]{(byte) (value & 0xFF)};
    }

    public static byte[] uInt16ToByteArray(int value) {
        return new byte[]{
                (byte) ((value >>> 8) & 0xFF),
                (byte) (value & 0xFF)
        };
    }

    public static byte[] uInt32ToByteArray(long value) {
        return new byte[]{
                (byte) (value >> 24 & 0xFF), (byte) (value >> 16 & 0xFF),
                (byte) (value >> 8 & 0xFF), (byte) (value >> 0 & 0xFF)
        };
    }

    public static byte[] int64ToByteArray(long value) {
        return new byte[]{
                (byte) (value >> 56 & 0xFF), (byte) (value >> 48 & 0xFF),
                (byte) (value >> 40 & 0xFF), (byte) (value >> 32 & 0xFF),
                (byte) (value >> 24 & 0xFF), (byte) (value >> 16 & 0xFF),
                (byte) (value >> 8 & 0xFF), (byte) (value >> 0 & 0xFF)
        };
    }

    public static byte[] uInt64ToByteArray(BigInteger value) {
        byte[] buffer = value.toByteArray();
        return Arrays.copyOfRange(buffer, buffer.length - 8, buffer.length);
    }

    public static byte[] stringToByteArray(String value, int length) {
        byte[] bytes = new byte[length];
        for (int i = 0; i < value.length(); i++) {
            char charValue = value.charAt(i);
            bytes[i] = (byte) charValue;
        }
        return bytes;
    }

    public static byte[] booleanToByteArray(boolean value) {
        return value ? Utils.uInt8ToByteArray(1) : Utils.uInt8ToByteArray(0);
    }


    public static int uInt8FromByteArray(byte[] bytes, int offset) {
        return bytes[offset] & 0xFF;
    }

    public static int uInt16FromByteArray(byte[] bytes, int offset) {
        return ((bytes[offset] & 0xFF) << 8) + (bytes[offset + 1] & 0xFF);
    }

    public static long uInt32FromByteArray(byte[] bytes, int offset) {
        return ((long) (bytes[offset] & 0xFF) << 24)
                + ((bytes[offset + 1] & 0xFF) << 16)
                + ((bytes[offset + 2] & 0xFF) << 8)
                + (bytes[offset + 3] & 0xFF);
    }
    
    public static long int64FromByteArray(byte[] bytes, int offset) {
        return ((long) (bytes[offset] & 0xFF) << 56)
                + ((long) (bytes[offset + 1] & 0xFF) << 48)
                + ((long) (bytes[offset + 2] & 0xFF) << 32)
                + ((long) (bytes[offset + 3] & 0xFF) << 24)
                + ((bytes[offset + 4] & 0xFF) << 16)
                + ((bytes[offset + 5] & 0xFF) << 16)
                + ((bytes[offset + 6] & 0xFF) << 8)
                + (bytes[offset + 7] & 0xFF);
    }

    public static BigInteger uInt64FromByteArray(byte[] bytes, int offset) {
        return new BigInteger(1, Arrays.copyOfRange(bytes, offset, offset + 8));

    }

    public static String stringFromByteArray(byte[] bytes, int offset, int length) {
        int stringLength = length;
        char[] chars = new char[length];
        for (int i = 0; i < chars.length; i++) {
            chars[i] |=  ((int) bytes[offset + i]);
            if(((int) bytes[offset + i]) == 0) {
                stringLength = stringLength - 1;
            }
        }
        return new String(Arrays.copyOfRange(chars, 0, stringLength));
    }

    public static boolean booleanFromByteArray(byte[] bytes, int offset) {
        return bytes != null && bytes.length != 0 && bytes[offset] != 0x00;
    }
}

abstract class ByteSerializable {

    int byteLength;

    abstract void toBytes(ByteBuffer buffer);

    abstract byte[] toBytes();

}
`;
