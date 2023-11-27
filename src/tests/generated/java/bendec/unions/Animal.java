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
    AnimalKind getKind();

    static AnimalKind getAnimalKind(byte[] bytes) {
        return AnimalKind.getAnimalKind(bytes, 0);
    }

    static Optional<Animal> createObject(byte[] bytes) {
        return createObject(getAnimalKind(bytes), bytes);
    }

    static Optional<Animal> createObject(AnimalKind type, byte[] bytes) {
        switch (type) {
            case ZEBRA:
                return Optional.of(new Zebra(bytes));
            case TOUCAN:
                return Optional.of(new Toucan(bytes));
            default:
                return Optional.empty();
        }
    }

    static Class findClassByDiscriminator(AnimalKind type) {
        return  typeToClassMap.get(type);
    }

    static AnimalKind findDiscriminatorByClass(Class clazz) {
        return  classToTypeMap.get(clazz);
    }

    HashMap<Class, AnimalKind> classToTypeMap = new HashMap<>(){{
        put(Zebra.class, AnimalKind.ZEBRA);
        put(Toucan.class, AnimalKind.TOUCAN);
    }};

    HashMap<AnimalKind, Class> typeToClassMap = new HashMap<>() {{
        put(AnimalKind.ZEBRA, Zebra.class);
        put(AnimalKind.TOUCAN, Toucan.class);
    }};
}