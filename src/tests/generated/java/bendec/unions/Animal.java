package bendec.unions;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import bendec.unions.AnimalKind;

import java.util.Optional;

public interface Animal {
    default AnimalKind getAnimalKind() {
        return this.getKind();
    }
    Kind getKind();

    static AnimalKind getAnimalKind(byte[] bytes) {
        return AnimalKind.getAnimalKind(bytes, 0);
    }

    static Optional<Object> createObject(AnimalKind type, byte[] bytes){
        switch (type) {

            case ZEBRA:
                return Optional.of(new Zebra(bytes));

            case TOUCAN:
                return Optional.of(new Toucan(bytes));

            default:
                return Optional.empty();
        }
    }

}