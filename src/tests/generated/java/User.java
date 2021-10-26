package com.my.package;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * <h2>User</h2>
 * <p>undefined</p>
 * <p>Byte length: 77</p>
 * <p>char > String (char[]) firstName - undefined | size 16</p>
 * <p>char > String (char[]) lastName - undefined | size 16</p>
 * <p>Uri uri - undefined | size 44</p>
 * <p>Age > int (u8) age - undefined | size 1</p>
 * */

public class User {

    private String firstName;
    private String lastName;
    private Uri uri;
    private int age;
    public static int byteLength = 77;

    public User(String firstName, String lastName, Uri uri, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.uri = uri;
        this.age = age;
    }

    public User() {
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

    @Override
    public int hashCode() {
        return Objects.hash(firstName, lastName, uri, age);
    }

    @Override
    public String toString() {
        return "User{" +
            "firstName=" + firstName +
            ", lastName=" + lastName +
            ", uri=" + uri +
            ", age=" + age +
            '}';
        }

}
