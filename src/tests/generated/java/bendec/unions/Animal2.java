package bendec.unions;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import bendec.unions.AnimalKind2;

import java.util.Optional;

public interface Animal2 {
    default AnimalKind2 getAnimalKind2() {
        return this.getHeader().getAnimalKind();
    }
    Header getHeader();

    static AnimalKind2 getAnimalKind2(byte[] bytes) {
        return AnimalKind2.getAnimalKind2(bytes, 0);
    }

    static Optional<Object> createObject(AnimalKind2 type, byte[] bytes){
        switch (type) {

            case ZEBRA2:
                return Optional.of(new Zebra2(bytes));

            case TOUCAN2:
                return Optional.of(new Toucan2(bytes));

            default:
                return Optional.empty();
        }
    }

}