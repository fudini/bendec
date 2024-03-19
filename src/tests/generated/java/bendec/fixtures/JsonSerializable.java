package bendec.fixtures;

import java.math.BigInteger;
import java.util.*;
    import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;
    
    public interface JsonSerializable {
    
        JsonMapper MAPPER = new JsonMapper();
      
        abstract ObjectNode toJson();
        abstract ObjectNode toJson(ObjectNode object);
    
    }