import devKeys from "./keys_dev";
import prodKeys from "./keys_prod";

function getKey() {
  if (process.env.NODE_ENV === "production") {
    return prodKeys
  } else {
    return devKeys
  }
}

const keys = getKey()

export default keys;
