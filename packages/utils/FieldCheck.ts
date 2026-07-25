
const Checkfields = (field:any) => {
  if (!field || typeof field !== "object" || Array.isArray(field)) {
    return { success: false, message: "Invalid fields payload" };
  }

  for (const key in field) {
    const Value = field[key];

    if (typeof Value === "string" && Value.startsWith("_")) {
      continue;
    }

    if (String(Value).trim() === "" || Value === null || Value === undefined) {
      return {
        success: false,
        message: `All field is required: ${key}`,
      };
    }
  }

  return { success: true };
};

export default Checkfields;