package bendec.unions;

import java.math.BigInteger;
import java.util.*;
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

    static Optional<Animal2> createObject(byte[] bytes) {
        return createObject(getAnimalKind2(bytes), bytes);
    }

    static Optional<Animal2> createObject(AnimalKind2 type, byte[] bytes) {
        switch (type) {
            case ZEBRA2:
                return Optional.of(new Zebra2(bytes));
            case TOUCAN2:
                return Optional.of(new Toucan2(bytes));
            default:
                return Optional.empty();
        }
    }

    static Class findClassByDiscriminator(AnimalKind2 type) {
        return  typeToClassMap.get(type);
    }

    static AnimalKind2 findDiscriminatorByClass(Class clazz) {
        return  classToTypeMap.get(clazz);
    }

    HashMap<Class, AnimalKind2> classToTypeMap = new HashMap<>(){{
        put(Zebra2.class, AnimalKind2.ZEBRA2);
        put(Toucan2.class, AnimalKind2.TOUCAN2);
    }};

    HashMap<AnimalKind2, Class> typeToClassMap = new HashMap<>() {{
        put(AnimalKind2.ZEBRA2, Zebra2.class);
        put(AnimalKind2.TOUCAN2, Toucan2.class);
    }};
}