package bendec.unions;

import java.math.BigInteger;
import java.util.*;


import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

public class BendecUtils {

    public static final int LENGTH_TIME = 8;

    private static final String HEXES = "0123456789ABCDEF";

    public static final BigInteger SECONDS_MARKER = BigInteger.valueOf(1000000000L);

    public static byte[] uInt8ToByteArray(int value) {
        return new byte[]{(byte) (value & 0xFF)};
    }

    public static byte[] uInt16ToByteArray(int value) {
        return new byte[]{
                (byte) (value & 0xFF),
                (byte) ((value >>> 8) & 0xFF),
        };
    }
    public static byte[] uInt32ToByteArray(long value) {
        return new byte[]{
                (byte) (value >> 0 & 0xFF), (byte) (value >> 8 & 0xFF),
                (byte) (value >> 16 & 0xFF), (byte) (value >> 24 & 0xFF),
        };
    }

    public static byte[] int64ToByteArray(long value) {
        return new byte[]{
                (byte) (value >> 0 & 0xFF), (byte) (value >> 8 & 0xFF),
                (byte) (value >> 16 & 0xFF), (byte) (value >> 24 & 0xFF),
                (byte) (value >> 32 & 0xFF), (byte) (value >> 40 & 0xFF),
                (byte) (value >> 48 & 0xFF), (byte) (value >> 56 & 0xFF),
        };
    }

    public static byte[] uInt64ToByteArray(BigInteger value) {
        byte[] bytes = value.toByteArray();
        int zerosCount = 8 - bytes.length;
        byte[] buffer = new byte[8];
        for(int i = 0; i < 8; i++) {
            if(i > 7 - zerosCount) {
                buffer[i] = 0;
            } else {
                buffer[i] = bytes[bytes.length - i - 1];
            }
        }
        return buffer;
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
        return value ? BendecUtils.uInt8ToByteArray(1) : BendecUtils.uInt8ToByteArray(0);
    }


    public static int uInt8FromByteArray(byte[] bytes, int offset) {
        return bytes[offset] & 0xFF;
    }

    public static int uInt16FromByteArray(byte[] bytes, int offset) {
        return ((bytes[offset + 1] & 0xFF) << 8) + (bytes[offset] & 0xFF);
    }

    public static long uInt32FromByteArray(byte[] bytes, int offset) {
        return ((long) (bytes[offset + 3] & 0xFF) << 24)
                + ((bytes[offset + 2] & 0xFF) << 16)
                + ((bytes[offset + 1] & 0xFF) << 8)
                + (bytes[offset] & 0xFF);
    }

    public static long int64FromByteArray(byte[] bytes, int offset) {
        return ((long) (bytes[offset + 7] & 0xFF) << 56)
                + ((long) (bytes[offset + 6] & 0xFF) << 48)
                + ((long) (bytes[offset + 5] & 0xFF) << 40)
                + ((long) (bytes[offset + 4] & 0xFF) << 32)
                + ((long) (bytes[offset + 3] & 0xFF) << 24)
                + ((bytes[offset + 2] & 0xFF) << 16)
                + ((bytes[offset + 1] & 0xFF) << 8)
                + (bytes[offset] & 0xFF);
    }

    public static BigInteger uInt64FromByteArray(byte[] bytes, int offset) {
        byte[] copy = Arrays.copyOfRange(bytes, offset, offset + 8);
        byte[] reversed = new byte[8];
        for(int i = 0; i < 8; i++) {
            reversed[i] = copy[7 - i];
        }
        return new BigInteger(1, reversed);
    }
    public static String stringFromByteArray(byte[] bytes, int offset, int length) {
        int stringLength = length;
        char[] chars = new char[length];
        for (int i = 0; i < chars.length; i++) {
            int value =  ((int) bytes[offset + i]);
            chars[i] |=  value;
            if(value == 0) {
                stringLength = stringLength - 1;
            }
        }
        return new String(Arrays.copyOfRange(chars, 0, stringLength));
    }

    public static boolean booleanFromByteArray(byte[] bytes, int offset) {
        return bytes != null && bytes.length != 0 && bytes[offset] != 0x00;
    }

    public static LocalDateTime localDateTimeFromByteArray(byte[] bytes, int offset) {
        BigInteger intValue = uInt64FromByteArray(bytes, offset);
        return localDateTimeFromBigInteger(intValue);
    }

    public static LocalDateTime localDateTimeFromBigInteger(BigInteger intValue) {
        BigInteger[] parts = intValue.divideAndRemainder(SECONDS_MARKER);
        return Instant.ofEpochSecond(parts[0].longValue(), parts[1].longValue()).atZone(ZoneOffset.UTC)
                .toLocalDateTime();
    }

    /**
     * Convert array of bytes to a human-readable format.
     *
     * @param bytes
     * @return human-readable string
     */
    public static String bytesToHexString(byte[] bytes) {
        String msg = "[";
        for (int i = 0; i < bytes.length; i++) {
            msg += HEXES.charAt((bytes[i] & 0xF0) >> 4);
            msg += HEXES.charAt((bytes[i] & 0x0F));
            if (i < bytes.length - 1) {
                msg += ",";
            }
        }
        msg += "]";
        return msg;
    }

}

