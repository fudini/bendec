package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>UserExtra</h2>
 * <p>undefined</p>
 * <p>Byte length: 253</p>
 * <p>char > String (char[]) firstName - undefined | size 16</p>
 * <p>char > String (char[]) lastName - undefined | size 16</p>
 * <p>Uri uri - undefined | size 44</p>
 * <p>Age > int (u8) age - undefined | size 1</p>
 * <p>Uri > Uri [] (Uri[]) uris - undefined | size 176</p>
 * */

public class UserExtra {

    private String firstName;
    private String lastName;
    private Uri uri;
    private int age;
    private Uri [] uris;
    public static int byteLength = 253;

    public UserExtra(String firstName, String lastName, Uri uri, int age, Uri [] uris) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.uri = uri;
        this.age = age;
        this.uris = uris;
    }

    public UserExtra() {
    }


    public String getFirstName() {
        return this.firstName;
    };
    public String getLastName() {
        return this.lastName;
    };
    public Uri getUri() {
        return this.uri;
    };
    public int getAge() {
        return this.age;
    };
    public Uri [] getUris() {
        return this.uris;
    };

    @Override
    public int hashCode() {
        return Objects.hash(firstName, lastName, uri, age, uris);
    }

    @Override
    public String toString() {
        return "UserExtra{" +
            "firstName=" + firstName +
            ", lastName=" + lastName +
            ", uri=" + uri +
            ", age=" + age +
            ", uris=" + uris +
            '}';
        }

}
